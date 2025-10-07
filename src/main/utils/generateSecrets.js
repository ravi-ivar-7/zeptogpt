/**
 * Generate secure JWT secrets for production use
 * Run this script to generate new secrets for your .env file
 */

import crypto from 'crypto'

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex')
}

console.log('=== JWT Secrets Generator ===\n')

console.log('Add these to your .env file:\n')
console.log(`JWT_ACCESS_SECRET=${generateSecureSecret(64)}`)
console.log(`JWT_REFRESH_SECRET=${generateSecureSecret(64)}`)
console.log(`NEXTAUTH_SECRET=${generateSecureSecret(32)}`)

console.log('\n=== Security Notes ===')
console.log('1. Keep these secrets secure and never commit them to version control')
console.log('2. Use different secrets for development and production')
console.log('3. Rotate secrets periodically for better security')
console.log('4. Access tokens should expire in 15-30 minutes')
console.log('5. Refresh tokens should expire in 7-30 days')
