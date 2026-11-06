import { Router } from "express";
import { validateMid } from "../middlewares/validarMiddleware.js";
import { verificarAdmin, verificarAdminOrDirectivo } from "../middlewares/verificarUser.js";
import { registrarUsuario, loginUsuario, logout, profile} from "../controllers/usuarios.controller.js"; 
import { loginSchema, registroSchema } from "../schemas/usuarios.schemas.js"; 
import { authToken } from "../middlewares/validarToken.js"; 
import { updateUserByPin } from "../models/profile.model.js"; 
import { updatePinSchema } from "../schemas/usuarios.schemas.js";
import { getAllNoticias, getNoticiaById, createNoticia, updateNoticia, deleteNoticia } from "../controllers/noticias.controller.js";
import { getUsuarios, createUsuario, updateUsuario, updateUsuarioActivo, deleteUsuario } from "../controllers/crud_usuarios.controller.js";
import { buscarNoticiasElastic } from "../services/elasticService.js";
import { createReporteSoporte, getMisReportes, getReportesAdmin, responderReporte } from "../controllers/soporte.controller.js";

const router = Router();

// Autenticación
router.post('/usuarios/registro', validateMid(registroSchema), registrarUsuario); 
router.post('/usuarios/login', validateMid(loginSchema), loginUsuario); 
router.post('/logout', logout); 
router.get('/usuarios/perfil', authToken, profile); 

// Actualización de PIN protegido
router.put('/usuarios/update/:id', validateMid(updatePinSchema), updateUserByPin); 

// Usuarios CRUD (solo para Admin)
router.get('/usuarios', getUsuarios);
router.post('/usuarios', validateMid(registroSchema), createUsuario);
router.put('/usuarios/:id', updateUsuario);
router.patch('/usuarios/:id/activo', updateUsuarioActivo);
router.delete('/usuarios/:id', deleteUsuario);

// Noticias
router.get('/noticias', getAllNoticias);
router.get('/noticias/:id', getNoticiaById);
router.post('/noticias/crear', createNoticia);
router.put('/noticias/update/:id', updateNoticia);
router.delete('/noticias/delete/:id', deleteNoticia);

// Soporte / Chat
router.post('/soporte', authToken, createReporteSoporte); // El usuario envía reporte
router.get('/soporte/mis-reportes/:usuario_id', authToken, getMisReportes); // El usuario ve su chat
router.get('/soporte/admin/pendientes', authToken, getReportesAdmin); // Admin ve todos los reportes
router.patch('/soporte/admin/responder/:id', authToken, responderReporte); // Admin responde un reporte

// Endpoint para el autocompletado en el Header
router.get('/noticias/buscar/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json([]);
    }
    const resultados = await buscarNoticiasElastic(q);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Error procesando la búsqueda' });
  }
});



export default router;