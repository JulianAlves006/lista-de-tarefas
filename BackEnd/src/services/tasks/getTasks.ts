import { db } from '../../database/model';

class TaskGeter {
  async getAllTasks(id_user: string) {
    try {
      if(!id_user) throw new Error('Você precisa logar para ver suas tarefas');
      const snapshot = await db
        .collection('tasks')
        .where('id_user', '==', id_user)
        .get();

      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return tasks;
    } catch (error) {
      return error;
    }
  }
}

export default new TaskGeter();
