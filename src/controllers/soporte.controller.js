import { pool } from '../config/db.js';

// POST: El usuario envía un nuevo mensaje/reporte
export const createReporteSoporte = async (req, res) => {
    try {
        const { usuario_id, mensaje } = req.body;
        
        if (!usuario_id || !mensaje) {
            return res.status(400).json({ message: 'Usuario y mensaje son obligatorios' });
        }

        const query = 'INSERT INTO reportes_soporte (usuario_id, mensaje) VALUES (?, ?)';
        await pool.query(query, [usuario_id, mensaje]);
        
        res.status(201).json({ message: 'Reporte enviado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar reporte' });
    }
};

// GET: El usuario consulta su historial de chat/reportes
export const getMisReportes = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        
        const query = 'SELECT * FROM reportes_soporte WHERE usuario_id = ? ORDER BY fecha_creacion ASC';
        const [reportes] = await pool.query(query, [usuario_id]);
        
        res.status(200).json(reportes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los reportes del usuario' });
    }
};

// GET: Para tu futura web Admin (Obtener todos los reportes pendientes)
export const getReportesAdmin = async (req, res) => {
    try {
        const query = `
            SELECT r.*, u.nombre, u.email 
            FROM reportes_soporte r 
            JOIN usuarios u ON r.usuario_id = u.id 
            ORDER BY r.fecha_creacion DESC
        `;
        const [reportes] = await pool.query(query);
        
        res.status(200).json(reportes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener todos los reportes' });
    }
};

// PUT/PATCH: (Futuro) El Admin responde a un reporte
export const responderReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const { respuesta_admin } = req.body;
        
        const query = `
            UPDATE reportes_soporte 
            SET respuesta_admin = ?, estado = 'Resuelto', fecha_respuesta = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await pool.query(query, [respuesta_admin, id]);
        
        res.status(200).json({ message: 'Reporte respondido con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al responder el reporte' });
    }
};