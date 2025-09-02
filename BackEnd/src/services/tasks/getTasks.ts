import { db } from '../../database/model';

class TaskGeter {
  async getAllTasks() {
    try {
      const snapshot = await db.collection('tasks').get();

      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return tasks;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async getTaskById(id: string) {
    try {
      const doc = await db.collection('tasks').doc(id).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}

export default new TaskGeter();
