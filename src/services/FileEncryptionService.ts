// File-level encryption service for password-based file protection

export interface IFileEncryptionService {
  isFileEncrypted(fileContent: string): boolean;
  encryptFile(fileContent: string, password: string): Promise<string>;
  decryptFile(encryptedFileContent: string, password: string): Promise<string>;
  validatePassword(encryptedFileContent: string, password: string): Promise<boolean>;
}

interface EncryptedFileData {
  version: string;
  algorithm: string;
  iv: string;
  salt: string;
  data: string;
  encrypted: true;
  fileType: 'reflection-notes';
}

export class WebCryptoFileEncryptionService implements IFileEncryptionService {
  private readonly ALGORITHM = 'AES-GCM';
  private readonly KEY_LENGTH = 256;
  private readonly IV_LENGTH = 12; // 96 bits for GCM
  private readonly SALT_LENGTH = 16; // 128 bits
  private readonly ITERATIONS = 100000; // PBKDF2 iterations
  private readonly VERSION = '1.0';

  /**
   * Check if file content is encrypted by looking for encryption metadata
   */
  isFileEncrypted(fileContent: string): boolean {
    try {
      const parsed = JSON.parse(fileContent);
      return parsed && 
             typeof parsed === 'object' && 
             parsed.encrypted === true &&
             parsed.version &&
             parsed.algorithm &&
             parsed.iv &&
             parsed.salt &&
             parsed.data &&
             parsed.fileType === 'reflection-notes';
    } catch {
      return false;
    }
  }

  /**
   * Encrypt entire file content with password
   */
  async encryptFile(fileContent: string, password: string): Promise<string> {
    try {
      // Generate random salt and IV
      const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
      const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));

      // Derive key from password using PBKDF2
      const keyMaterial = await this.importKeyMaterial(password);
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: this.ITERATIONS,
          hash: 'SHA-256'
        },
        keyMaterial,
        {
          name: this.ALGORITHM,
          length: this.KEY_LENGTH
        },
        false,
        ['encrypt']
      );

      // Encrypt the entire file content
      const encoder = new TextEncoder();
      const data = encoder.encode(fileContent);
      const encrypted = await crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv
        },
        key,
        data
      );

      // Create encrypted file structure
      const encryptedFileData: EncryptedFileData = {
        version: this.VERSION,
        algorithm: this.ALGORITHM,
        iv: this.arrayBufferToBase64(iv.buffer),
        salt: this.arrayBufferToBase64(salt.buffer),
        data: this.arrayBufferToBase64(encrypted),
        encrypted: true,
        fileType: 'reflection-notes'
      };

      return JSON.stringify(encryptedFileData, null, 2);
    } catch (error) {
      console.error('File encryption failed:', error);
      throw new Error('Failed to encrypt file');
    }
  }

  /**
   * Decrypt entire file content with password
   */
  async decryptFile(encryptedFileContent: string, password: string): Promise<string> {
    try {
      if (!this.isFileEncrypted(encryptedFileContent)) {
        throw new Error('File is not encrypted');
      }

      const encryptedData: EncryptedFileData = JSON.parse(encryptedFileContent);
      
      // Validate encryption metadata
      if (encryptedData.version !== this.VERSION) {
        throw new Error('Unsupported encryption version');
      }
      if (encryptedData.algorithm !== this.ALGORITHM) {
        throw new Error('Unsupported encryption algorithm');
      }
      if (encryptedData.fileType !== 'reflection-notes') {
        throw new Error('Invalid file type');
      }

      // Convert base64 back to ArrayBuffer
      const salt = this.base64ToArrayBuffer(encryptedData.salt);
      const iv = this.base64ToArrayBuffer(encryptedData.iv);
      const data = this.base64ToArrayBuffer(encryptedData.data);

      // Derive key from password
      const keyMaterial = await this.importKeyMaterial(password);
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: this.ITERATIONS,
          hash: 'SHA-256'
        },
        keyMaterial,
        {
          name: this.ALGORITHM,
          length: this.KEY_LENGTH
        },
        false,
        ['decrypt']
      );

      // Decrypt the data
      const decrypted = await crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv
        },
        key,
        data
      );

      // Convert back to string
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      if (error instanceof Error && error.message.includes('decrypt')) {
        throw new Error('Invalid password or corrupted data');
      }
      console.error('File decryption failed:', error);
      throw new Error('Failed to decrypt file');
    }
  }

  /**
   * Validate password without fully decrypting (for quick validation)
   */
  async validatePassword(encryptedFileContent: string, password: string): Promise<boolean> {
    try {
      await this.decryptFile(encryptedFileContent, password);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Import password as key material for PBKDF2
   */
  private async importKeyMaterial(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    return crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert base64 string to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
