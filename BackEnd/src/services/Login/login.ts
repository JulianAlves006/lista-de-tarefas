import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { db } from '../../database/model';

const JWT_SECRET = process.env.JWT_SECRET as string;

export default new (class LoginService {
  async login(body: any) {
    const { email, password } = body;
    if (!email || !password)
      return 'Todos os dados devem ser preenchidos antes de realizar a requisição para o banco de dados';

    try {
      const snap = await db
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      if (snap.empty) throw new Error('Usuário ou senha inválidos');

      const userData = snap.docs[0].data();
      const isValid = await checkPassword(password, userData.passwordHash);
      if (!isValid) throw new Error('Usuário ou senha inválidos');

      const payload = {
        id_fire: snap.docs[0].id,
        id: userData.id,
        name: userData.name,
        email: email,
        role: userData.role || 'user',
      };

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '5h', // tempo de expiração
      });

      return {
        message: 'Login realizado com sucesso!',
        token: token,
        user: {
          id_fire: payload.id_fire,
          id: userData.id,
          name: payload.name,
          email: payload.email,
          role: userData.role || 'admin',
        },
      };
    } catch (error) {
      return error;
    }
  }
})();

export async function checkPassword(
  plainPassword: string,
  passwordHash: string
): Promise<boolean> {
  return await argon2.verify(passwordHash, plainPassword);
}
