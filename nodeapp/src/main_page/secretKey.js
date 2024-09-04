import crypto from 'crypto'

// 256비트(32바이트) 비밀 키 생성
const secretKey = crypto.randomBytes(32).toString('hex');

console.log('Generated Secret Key:', secretKey);