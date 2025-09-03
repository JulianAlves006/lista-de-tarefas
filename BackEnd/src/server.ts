import 'dotenv/config';
import app from './app';

const port = process.env.APP_PORT;

const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`http://localhost:${port}`);
});

app.on('error', error => {
  console.error('Erro no servidor:', error);
});

