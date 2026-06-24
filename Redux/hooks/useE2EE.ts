import { useEffect, useState, useCallback } from 'react';
import { 
  generateRSAKeyPair, 
  exportPublicKeyPEM, 
  exportPrivateKeyJWK, 
  importPrivateKeyJWK, 
  importPublicKeyPEM,
  encryptMessage,
  decryptMessage
} from '../../utils/crypto';
import { useRegisterPublicKeyMutation } from '../api/messageApi';
import { useAppSelector } from '../store/hooks';

const PRIVATE_KEY_STORAGE_KEY = 'e2ee_private_key_jwk';
const PUBLIC_KEY_STORAGE_KEY = 'e2ee_public_key_pem';

export const useE2EE = () => {
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const [publicKey, setPublicKey] = useState<CryptoKey | null>(null);
  const [publicKeyPEM, setPublicKeyPEM] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [registerPublicKey] = useRegisterPublicKeyMutation();
  const user = useAppSelector((state) => state.auth.user);

  const initKeys = useCallback(async () => {
    try {
      setIsInitializing(true);
      
      const storedPrivateKeyJWK = localStorage.getItem(PRIVATE_KEY_STORAGE_KEY);
      const storedPublicKeyPEM = localStorage.getItem(PUBLIC_KEY_STORAGE_KEY);

      if (storedPrivateKeyJWK && storedPublicKeyPEM) {
        // Import existing keys
        const privKey = await importPrivateKeyJWK(storedPrivateKeyJWK);
        const pubKey = await importPublicKeyPEM(storedPublicKeyPEM);
        
        setPrivateKey(privKey);
        setPublicKey(pubKey);
        setPublicKeyPEM(storedPublicKeyPEM);

        // Always register public key on every login — server is idempotent (upserts)
        // This ensures the server always has the latest key, even after server resets
        if (user) {
          try {
            await registerPublicKey({ publicKey: storedPublicKeyPEM }).unwrap();
          } catch (error) {
            // Non-fatal — key may already be current on server
          }
        }
      } else {
        // Generate new keys
        const keyPair = await generateRSAKeyPair();
        const pubKeyPEM = await exportPublicKeyPEM(keyPair.publicKey);
        const privKeyJWK = await exportPrivateKeyJWK(keyPair.privateKey);

        localStorage.setItem(PRIVATE_KEY_STORAGE_KEY, privKeyJWK);
        localStorage.setItem(PUBLIC_KEY_STORAGE_KEY, pubKeyPEM);

        setPrivateKey(keyPair.privateKey);
        setPublicKey(keyPair.publicKey);
        setPublicKeyPEM(pubKeyPEM);

        // Register newly generated key with server
        if (user) {
          await registerPublicKey({ publicKey: pubKeyPEM }).unwrap();
        }
      }
    } catch (error) {
      console.error('Failed to initialize E2EE keys:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [user, registerPublicKey]);

  useEffect(() => {
    if (user) {
      initKeys();
    }
  }, [user, initKeys]);

  const encrypt = useCallback(async (plaintext: string, recipientPublicKeyPEM: string) => {
    if (!publicKey || !recipientPublicKeyPEM) return null;
    
    const recipientPublicKey = await importPublicKeyPEM(recipientPublicKeyPEM);
    return await encryptMessage(plaintext, recipientPublicKey, publicKey);
  }, [publicKey]);

  const decrypt = useCallback(async (
    message: { 
      senderCopy: string; 
      recipientCopy: string; 
      iv: string; 
      encryptedKey: string; 
      senderId: string;
    }
  ) => {
    if (!privateKey || !user) return null;

    const isSender = message.senderId === user.id;
    const encryptedAESKey = isSender ? message.senderCopy : message.encryptedKey;
    
    try {
      return await decryptMessage(
        encryptedAESKey,
        message.recipientCopy,
        message.iv,
        privateKey
      );
    } catch (error) {
      console.error('Decryption failed:', error);
      return '[Decryption Error]';
    }
  }, [privateKey, user]);

  return {
    publicKeyPEM,
    isInitializing,
    encrypt,
    decrypt,
  };
};
