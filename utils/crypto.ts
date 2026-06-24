/**
 * Encryption Utilities for End-to-End Encryption (E2EE)
 * Using Web Crypto API (RSA-OAEP 2048, AES-256-GCM)
 */

// Helper: Convert ArrayBuffer to Base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Convert Base64 to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Helper: Convert ArrayBuffer to Hex string
export function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper: Convert Hex string to ArrayBuffer
export function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

// 1. Generate RSA Key Pair
export async function generateRSAKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true, // extractable
    ["encrypt", "decrypt"]
  );
}

// 2. Export Public Key to PEM format
export async function exportPublicKeyPEM(publicKey: CryptoKey): Promise<string> {
  const spki = await window.crypto.subtle.exportKey("spki", publicKey);
  const b64 = arrayBufferToBase64(spki);
  const pem = `-----BEGIN PUBLIC KEY-----\n${b64.match(/.{1,64}/g)?.join("\n")}\n-----END PUBLIC KEY-----`;
  return pem;
}

// 3. Import Public Key from PEM format
export async function importPublicKeyPEM(pem: string): Promise<CryptoKey> {
  const b64 = pem
    .replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace(/\s/g, "");
  const spki = base64ToArrayBuffer(b64);
  return await window.crypto.subtle.importKey(
    "spki",
    spki,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

// 4. Export Private Key to JWK (for local storage)
export async function exportPrivateKeyJWK(privateKey: CryptoKey): Promise<string> {
  const jwk = await window.crypto.subtle.exportKey("jwk", privateKey);
  return JSON.stringify(jwk);
}

// 5. Import Private Key from JWK
export async function importPrivateKeyJWK(jwkString: string): Promise<CryptoKey> {
  const jwk = JSON.parse(jwkString);
  return await window.crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
}

// 6. Hybrid Encryption: Encrypt message for recipient and sender
export async function encryptMessage(
  plaintext: string,
  recipientPublicKey: CryptoKey,
  senderPublicKey: CryptoKey
) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // AES-256 key generate
  const aesKey = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Encrypt plaintext with AES
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    data
  );

  // Export AES key to raw bytes
  const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

  // Encrypt AES key with recipient's RSA public key
  const encryptedKey = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    recipientPublicKey,
    rawAesKey
  );

  // Sender copy: encrypt the SAME AES key with sender's own public key
  const senderCopy = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    senderPublicKey,
    rawAesKey
  );

  return {
    recipientCopy: arrayBufferToBase64(ciphertext),
    senderCopy: arrayBufferToBase64(senderCopy),
    iv: arrayBufferToHex(iv.buffer as ArrayBuffer),
    encryptedKey: arrayBufferToBase64(encryptedKey),
  };
}

// 7. Decrypt message (generic for both recipient and sender)
export async function decryptMessage(
  encryptedAESKeyB64: string,
  ciphertextB64: string,
  ivHex: string,
  privateKey: CryptoKey
): Promise<string> {
  // 1. Decrypt AES key with RSA private key
  const aesKeyRaw = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    base64ToArrayBuffer(encryptedAESKeyB64)
  );

  // 2. Import the decrypted AES key
  const aesKey = await window.crypto.subtle.importKey(
    "raw",
    aesKeyRaw,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  // 3. Decrypt ciphertext with AES key
  const plaintextBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: hexToArrayBuffer(ivHex) },
    aesKey,
    base64ToArrayBuffer(ciphertextB64)
  );

  return new TextDecoder().decode(plaintextBuffer);
}
