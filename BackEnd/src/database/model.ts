import * as admin from 'firebase-admin';
import express from 'express';
import * as serviceAccount from '../desafio-pleno-firebase-adminsdk-fbsvc-04f71a1d57.json';
const app = express();

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  });
  console.log('Conectado com db');
} catch (error) {
  console.error(error);
}

export const db = admin.firestore();
