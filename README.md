# 📝 Task Manager - CRUD de Tarefas com Autenticação

Este é um projeto **fullstack** desenvolvido como desafio de estudo/prática, unindo **React (frontend)** e **Node.js + Express + TypeScript (backend)**, com persistência em **NoSQL (Firestore)**.  
A aplicação implementa um **CRUD de lista de tarefas** e inclui **funcionalidades de autenticação de usuários** (cadastro e login com senha criptografada e JWT).

---

## ✨ Funcionalidades

✅ Criar usuário com senha segura (hash com Argon2)  
✅ Login com emissão de **JWT**  
✅ CRUD de tarefas:
- Criar tarefa
- Listar tarefas
- Editar tarefa
- Excluir tarefa (com modal de confirmação)  
✅ Relacionar cada tarefa ao computador em que foi criada (`os.hostname()`)  
✅ Proteção de rotas com token JWT  
✅ Frontend em React com **React Router**, **React Icons**, **React Modal** e **React Toastify**  

---

## 🛠️ Tecnologias Utilizadas

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase Admin SDK / Firestore](https://firebase.google.com/)
- [argon2](https://www.npmjs.com/package/argon2) (hash de senhas)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

### Frontend
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router DOM](https://reactrouter.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [React Modal](https://www.npmjs.com/package/react-modal)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [styled-components](https://styled-components.com/)

---
### Estrutura
```
/backend
  ├── src
  │   ├── controllers
  │   ├── database
  │   ├── routes
  │   ├── services
  │   ├── middlewares
  |   ├── app.ts
  │   └── server.ts
/frontend
  ├── src
  │   ├── components
  │   ├── pages
  │   ├── config
  │   ├── styles
  │   ├── services
  │   ├── routes
  │   └── main.tsx
```
