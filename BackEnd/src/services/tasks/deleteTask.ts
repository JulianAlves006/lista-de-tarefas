import { db } from '../../database/model';

class TaskDeleter {
  async deleteTask(id: string) {
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
