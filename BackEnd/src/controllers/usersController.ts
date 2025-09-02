import UserCreater from '../services/user/createUser';

class UserController {
  async createUser(req: any, res: any) {
    const response = await UserCreater.createUser(req.body);
    res.status(200).json(response);
  }
}

export default new UserController;
