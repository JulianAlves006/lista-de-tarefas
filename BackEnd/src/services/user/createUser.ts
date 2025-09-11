// src/services/user.service.ts
import { db } from '../../database/model';
import {randomUUID} from 'node:crypto'
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

import { User } from '../../controllers/usersController';

const JWT_SECRET = process.env.JWT_SECRET as string;

export default class UserService {
  static usersCol = db.collection('users');

  static async createUser(body: any) {
    try {
      const id = randomUUID()
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
        id,
        name,
        email,
        passwordHash,
        createdAt: Date.now(),
        role: 'admin',
      };

      const payload = {
        id: id,
        email: email,
        role: 'admin',
      };

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '5h', // tempo de expiração
      });

      await this.usersCol.add(user);
      // Evite retornar passwordHash
      return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt, token: token };
    } catch (error) {
      return error;
    }
  }
}
