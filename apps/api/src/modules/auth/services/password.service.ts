import { hash, verify } from '@node-rs/argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  hash(password: string) {
    return hash(password);
  }

  async verify(passwordHash: string, password: string) {
    try {
      return await verify(passwordHash, password);
    } catch {
      return false;
    }
  }
}
