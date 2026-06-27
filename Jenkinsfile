pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "softvence/doc-frontend"
        DOCKER_TAG = "latest"
        CONTAINER_NAME = "doc-frontend"
        SSH_HOST = "187.77.23.79"
        SSH_CREDENTIALS_ID = "doc-ssh-creds"
        SERVER_PATH = "/var/projects/doc-frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "Building Docker image..."
                    docker compose build
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''
                        echo "Logging into DockerHub..."
                        echo "$DOCKER_PASS" | docker login \
                            -u "$DOCKER_USER" \
                            --password-stdin

                        echo "Pushing Docker images..."
                        docker compose push

                        docker logout
                        echo "Docker images pushed successfully."
                    '''
                }
            }
        }

        stage('Push Docker Compose File') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: env.SSH_CREDENTIALS_ID,
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                        echo "Uploading docker-compose.yaml to server..."
                        chmod 600 "$SSH_KEY"
                        echo "Connecting to $SSH_USER@$SSH_HOST"
                        ssh -i "$SSH_KEY" \
                            -o BatchMode=yes \
                            -o IdentitiesOnly=yes \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$SSH_HOST" \
                            "mkdir -p '$SERVER_PATH'"
                        scp -i "$SSH_KEY" \
                            -o BatchMode=yes \
                            -o IdentitiesOnly=yes \
                            -o StrictHostKeyChecking=no \
                            docker-compose.yaml \
                            "$SSH_USER@$SSH_HOST:$SERVER_PATH/docker-compose.yaml"
                        echo "docker-compose.yaml uploaded successfully."
                    '''
                }
            }
        }

        stage('Deploy New Docker Image') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: env.SSH_CREDENTIALS_ID,
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                        echo "Pulling and starting latest Docker image on server..."
                        chmod 600 "$SSH_KEY"
                        echo "Connecting to $SSH_USER@$SSH_HOST"
                        ssh -i "$SSH_KEY" \
                            -o BatchMode=yes \
                            -o IdentitiesOnly=yes \
                            -o StrictHostKeyChecking=no \
                            "$SSH_USER@$SSH_HOST" \
                            "
                            cd '$SERVER_PATH' &&
                            docker compose pull &&
                            docker compose up -d &&
                            docker image prune -f
                        "
                        echo "Deployment completed on server."
                    '''
                }
            }
        }
    }

    post {

        always {
            echo "Pipeline execution finished."
        }

        success {
            echo "Deployment successful 🚀"
        }

        failure {
            echo "Pipeline failed ❌"
        }
    }
}

