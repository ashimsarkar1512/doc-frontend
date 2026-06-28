FROM node:24-alpine AS builder

# 1. Accept arguments from docker-compose
ARG NODE_ENV
ARG NEXT_TELEMETRY_DISABLED
ARG NEXT_PUBLIC_API_BASE_URL

WORKDIR /app

COPY package.json ./

RUN npm install --force

COPY . .

# 2. Set environment variables so 'npm run build' can access them
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED}
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Optional: Increase Node.js memory limit if the build is heavy
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

# --- Runner Stage ---

FROM node:24-alpine AS runner

WORKDIR /app

# Ensure runtime env vars are set here too (though they are usually set at runtime by docker-compose)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

# Start with Node runtime
CMD ["npm", "start"]