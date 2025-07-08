import crypto from 'crypto';

const password = 'password';

for (let i = 0; i < 25; i++) {
  const salt = crypto.randomBytes(16).toString('hex');
  crypto.scrypt(password, salt, 16, (err, derivedKey) => {
    if (err) throw err;
    const hash = derivedKey.toString('hex');
    console.log(`Hash generato: ${hash}`);
    console.log(`Sale generato: ${salt}`);
  });
}