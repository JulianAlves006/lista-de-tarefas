import { db } from '../../database/model';
import argon2 from 'argon2';

export default async function editUser(data: any){
  try {
    const { id, name, email, password} = data;

    if(!id || !email || !name) throw new Error('Todas as informações devem estar preenchidas');
    if(!password) throw new Error('Senha é obrigatória para edição');

    const snapshot = await db
        .collection('users')
        .where('id', '==', id)
        .limit(1)
        .get();

    if (snapshot.empty) {
      throw new Error('Usuário não encontrada');
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if(userData.email !== email){
      const existsSnap = await db.collection('users').where('email', '==', email).limit(1).get();
      if (!existsSnap.empty) throw new Error('E-mail já cadastrado');
    }

    const isValid = await checkPassword(password, userData.passwordHash);
    if(!isValid) throw new Error('Senha incorreta!');

    //Verificação de garantia
    if(userData.id !== id) throw new Error('Este usuário não pode realizar está ação!');
    await userDoc.ref.update({
      name,
      email
    });
    return {
      message: 'Usuário editado com sucesso',
      id,
      name,
      email,
    };
  } catch (error) {
    return error;
  }
}

export async function checkPassword(
  plainPassword: string,
  passwordHash: string
): Promise<boolean> {
  return await argon2.verify(passwordHash, plainPassword);
}
