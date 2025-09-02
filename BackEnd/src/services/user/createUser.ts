// src/services/user.service.ts
import { db } from '../../database/model';
import {randomUUID} from 'node:crypto'
import argon2 from 'argon2';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
  role?: 'user' | 'admin';
}

export default class UserService {
  static usersCol = db.collection('users');

  static async createUser(body: any) {
    const { name, email, password } = body ?? {};
    if (!name || !email || !password) {
      throw new Error('Todos os campos são obrigatórios');
    }

    // verifica se já existe usuário com o mesmo email
    const existsSnap = await this.usersCol.where('email', '==', email).limit(1).get();
    if (!existsSnap.empty) throw new Error('E-mail já cadastrado');

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    const user: User = {
      id: randomUUID(),
      name,
      email,
      passwordHash,
      createdAt: Date.now(),
      role: 'admin',
    };

    await this.usersCol.add(user);
    // Evite retornar passwordHash
    return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
  }
}
