import { db } from '../../database/model';

class TaskDeleter {
  async deleteTask(id: string, id_user: string) {
    try {
      const snapshot = await db
        .collection('tasks')
        .where('id', '==', id)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error('Task não encontrada');
      }

      // Deletar o documento encontrado
      const taskDoc = snapshot.docs[0];
      const taskData = taskDoc.data();

      if(taskData.id_user !== id_user) throw new Error('Este usuário não pode realizar está ação!')
      await taskDoc.ref.delete();

      return {
        message: 'Task deletada com sucesso',
        id: id,
      };
    } catch (error) {
      console.error('Erro ao deletar task:', error);
      throw error;
    }
  }
}

export default new TaskDeleter();
