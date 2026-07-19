import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import adminRoutes from '../routes/admin.routes.js';

const app = express();
app.use(express.json());

// Configuración CORS para múltiples orígenes
const allowedOrigins = ['http://localhost:5173', 'http://localhost:51231'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No autorizado por CORS'));
      }
    },
    credentials: true, // Para permitir cookies/sesiones
    exposeHeaders: ['Content-Disposition'] 
  })
);

app.use(cookieParser());
// Para archivos de la carpeta uploads
app.use('/uploads', express.static('uploads'));
// Ruta principal de las APIs
app.use('/api', adminRoutes);


export default app;