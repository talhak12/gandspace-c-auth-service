import crypto from 'crypto';
import fs from 'fs';
import { type } from 'os';
import { format } from 'path';

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
});

fs.writeFileSync('certs/private.pem', privateKey);
fs.writeFileSync('certs/public.pem', publicKey);