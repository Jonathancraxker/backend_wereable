import { Router } from "express";
import { validateMid } from "../middlewares/validarMiddleware.js";
import { registrarUsuario, loginUsuario, logout, profile} from "../controllers/usuarios.controller.js"; 
import { loginSchema, registroSchema } from "../schemas/usuarios.schemas.js"; 
import { authToken } from "../middlewares/validarToken.js"; 
import { updateUserByPin } from "../models/profile.model.js"; 
import { updatePinSchema } from "../schemas/usuarios.schemas.js";
import { getAllNoticias, getNoticiaById, createNoticia, updateNoticia, deleteNoticia } from "../controllers/noticias.controller.js";

const router = Router();

// Autenticación
router.post('/usuarios/registro', validateMid(registroSchema), registrarUsuario); 
router.post('/usuarios/login', validateMid(loginSchema), loginUsuario); 
router.post('/logout', logout); 

// Perfil de usuario protegido
router.get('/usuarios/perfil', authToken, profile); 

// Actualización de PIN protegido
router.put('/usuarios/update/:id', validateMid(updatePinSchema), updateUserByPin); 

// Noticias
router.get('/noticias', getAllNoticias);
router.get('/noticias/:id', getNoticiaById);
router.post('/noticias/crear', createNoticia);
router.put('/noticias/update/:id', updateNoticia);
router.delete('/noticias/delete/:id', deleteNoticia);

export default router;