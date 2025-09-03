import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: any, next: any) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).send('Sem autorização');

    const parts = authorization.split(' ');

    if (parts.length !== 2) return res.status(401).send('Sem autorização');

    const [schema, token] = parts;

    if (schema !== 'bearer') return res.status(401).send('Sem autorização');

    const JWT_SECRET = process.env.JWT_SECRET as string;

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      req.user = jwt.decode(token);

      next();
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
