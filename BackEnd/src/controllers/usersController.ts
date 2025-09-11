import UserCreater from '../services/user/createUser';
import editUser from '../services/user/editUser';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
  role?: 'user' | 'admin';
}

class UserController {
  async createUser(req: any, res: any) {
    try {
      const response = await UserCreater.createUser(req.body);

      if (response instanceof Error) {
        return res.status(400).json({ error: response.message });
      }

      return res.status(200).json(response);
    } catch (error) {
      console.error('Erro no controller de user:', error);
      return res.status(500).json({ error });
    }
  }

  async updateUser(req: any, res: any){
    try {
      const response = await editUser(req.body);
      if (response instanceof Error) {
        return res.status(400).json({ error: response.message });
      }
      res.status(200).json(response);
    } catch (error) {
      console.error('Erro no controller de user:', error);
      return res.status(500).json({ error });
    }
  }
}

export default new UserController;
