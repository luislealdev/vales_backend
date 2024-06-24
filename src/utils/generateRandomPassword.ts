import { randomBytes } from 'crypto';

export function generateRandomPassword(): string {
    const caracteres: string = `${randomBytes(26).toString('base64')}${randomBytes(10).toString('base64')}${randomBytes(32).toString('base64')}`;
    let contraseña: string = "";
  
    for (let i = 0; i < 6; i++) {
      contraseña += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
  
    return contraseña;
  }
  