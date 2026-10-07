import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import adminRoutes from '../routes/admin.routes.js';

const app = express();
app.use(express.json());

// Configuración CORS para múltiples orígenes
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5000', 'https://doriga-news.vercel.app', 'http://localhost', 'capacitor://localhost'];

app.use(
  cors({
    origin: (origin, callback) => {
      // 1. Imprimimos el origen exacto en los logs de Render para atraparlo
      console.log('=== ORIGEN INTENTANDO CONECTAR === :', origin);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // 2. Si no está en la lista, lo dejamos pasar temporalmente para que no te bloquee
        console.warn(`Permitiendo acceso temporal al origen desconocido: ${origin}`);
        callback(null, true); 
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