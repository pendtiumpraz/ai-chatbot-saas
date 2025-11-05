import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

// Get encryption key from environment variable
function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || 'default-encryption-secret-change-in-production';
  return crypto.scryptSync(secret, 'salt', KEY_LENGTH);
}

/**
 * Encrypt sensitive data (like API keys)
 */
export function encrypt(text: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  // Combine salt + iv + tag + encrypted
  return salt.toString('hex') + iv.toString('hex') + tag.toString('hex') + encrypted;
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedText: string): string {
  const key = getKey();

  const salt = Buffer.from(encryptedText.slice(0, SALT_LENGTH * 2), 'hex');
  const iv = Buffer.from(encryptedText.slice(SALT_LENGTH * 2, TAG_POSITION * 2), 'hex');
  const tag = Buffer.from(encryptedText.slice(TAG_POSITION * 2, ENCRYPTED_POSITION * 2), 'hex');
  const encrypted = encryptedText.slice(ENCRYPTED_POSITION * 2);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Mask API key for display (show only first/last chars)
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '****';
  
  // For keys like: sk-proj-xxxxx or API_KEY_xxxxx
  const parts = key.split('-');
  
  if (parts.length > 1) {
    // Show prefix and last 4 chars
    return `${parts[0]}-...${key.slice(-4)}`;
  }
  
  // Default masking
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

/**
 * Validate API key format (basic check)
 */
export function isValidApiKeyFormat(provider: string, key: string): boolean {
  const patterns: Record<string, RegExp> = {
    openai: /^sk-[a-zA-Z0-9]{20,}$|^sk-proj-[a-zA-Z0-9_-]{20,}$/,
    anthropic: /^sk-ant-[a-zA-Z0-9_-]{20,}$/,
    google: /^[a-zA-Z0-9_-]{20,}$/,
    custom: /^.{10,}$/, // At least 10 chars for custom
  };

  const pattern = patterns[provider];
  return pattern ? pattern.test(key) : key.length >= 10;
}
