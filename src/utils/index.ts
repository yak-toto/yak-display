import { decodeJwt } from 'jose';

export default function isValidJwt(jwt: string): boolean {
  if (!jwt) {
    return false;
  }

  try {
    // Decode JWT payload without verification (since we only check expiration)
    const payload = decodeJwt(jwt);

    // Check if exp claim exists and is a number
    if (typeof payload.exp !== 'number') {
      return false;
    }

    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    // Invalid JWT format or malformed token
    return false;
  }
}
