import LoginService from '../services/Login/login';

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

class Login {
  async login(req: any, res: any) {
    try {
      const response = await LoginService.login(req.body);

      if (typeof response === 'string') {
        return res.status(400).json({ error: response });
      }

      if (response instanceof Error) {
        return res.status(400).json({ error: response.message });
      }

      if (response && (response as LoginResponse).token) {
        return res.status(200).json(response);
      }

      return res.status(500).json({ error: 'Erro interno do servidor' });
    } catch (error) {
      console.error('Erro no controller de login:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default new Login();
