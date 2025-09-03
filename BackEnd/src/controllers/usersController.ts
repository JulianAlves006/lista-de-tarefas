import UserCreater from '../services/user/createUser';

class UserController {
  async createUser(req: any, res: any) {
    try {
      const response = await UserCreater.createUser(req.body);

      if (response instanceof Error) {
        return res.status(400).json({ error: response.message });
      }

      return res.status(200).json(response);
    } catch (error) {
      console.error('Erro no controller de login:', error);
      return res.status(500).json({ error });
    }
  }
}

export default new UserController;
