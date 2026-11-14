import { pool } from '../config/db.js';

// 1. POST: Crear un nuevo reporte/ticket con su mensaje inicial
export const createReporteSoporte = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { usuario_id, asunto, mensaje } = req.body;

        if (!usuario_id || !asunto || !mensaje) {
            return res.status(400).json({ message: 'Usuario, asunto y mensaje son obligatorios' });
        }

        await connection.beginTransaction();

        // Crear el ticket
        const [resultReporte] = await connection.query(
            'INSERT INTO reportes_soporte (usuario_id, asunto) VALUES (?, ?)',
            [usuario_id, asunto]
        );
        const reporteId = resultReporte.insertId;

        // Insertar el primer mensaje del usuario en ese ticket
        await connection.query(
            'INSERT INTO mensajes_soporte (reporte_id, remitente, mensaje) VALUES (?, ?, ?)',
            [reporteId, 'usuario', mensaje]
        );

        await connection.commit();
        res.status(201).json({ 
            message: 'Reporte creado con éxito', 
            reporte_id: reporteId 
        });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error al crear el reporte' });
    } finally {
        connection.release();
    }
};

// 2. GET: Obtener la lista de reportes de un usuario (para la pantalla previa al chat)
export const getMisReportes = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const query = `
            SELECT * FROM reportes_soporte 
            WHERE usuario_id = ? 
            ORDER BY fecha_actualizacion DESC
        `;
        const [reportes] = await pool.query(query, [usuario_id]);
        res.status(200).json(reportes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los reportes del usuario' });
    }
};

// 3. GET: Obtener info del ticket y todos sus mensajes (sirve para App Móvil y Web Admin)
export const getMensajesPorReporte = async (req, res) => {
    try {
        const { reporte_id } = req.params;

        const [reporteRows] = await pool.query(
            `SELECT r.*, u.nombre AS nombre_usuario, u.email 
             FROM reportes_soporte r 
             JOIN usuarios u ON r.usuario_id = u.id 
             WHERE r.id = ?`,
            [reporte_id]
        );

        if (reporteRows.length === 0) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }

        const [mensajes] = await pool.query(
            'SELECT * FROM mensajes_soporte WHERE reporte_id = ? ORDER BY fecha_envio ASC',
            [reporte_id]
        );

        res.status(200).json({
            reporte: reporteRows[0],
            mensajes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la conversación' });
    }
};

// 4. POST: Enviar un nuevo mensaje dentro de un reporte existente (Usuario o Admin)
export const enviarMensajeChat = async (req, res) => {
    try {
        const { reporte_id } = req.params;
        const { remitente, mensaje } = req.body; // remitente: 'usuario' | 'admin'

        if (!remitente || !mensaje || !['usuario', 'admin'].includes(remitente)) {
            return res.status(400).json({ message: 'Remitente válido y mensaje son obligatorios' });
        }

        // Verificar que el reporte exista y no esté resuelto
        const [reporte] = await pool.query('SELECT estado FROM reportes_soporte WHERE id = ?', [reporte_id]);
        if (reporte.length === 0) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        if (reporte[0].estado === 'Resuelto') {
            return res.status(400).json({ message: 'Este reporte ya está resuelto y cerrado' });
        }

        // Guardar mensaje
        await pool.query(
            'INSERT INTO mensajes_soporte (reporte_id, remitente, mensaje) VALUES (?, ?, ?)',
            [reporte_id, remitente, mensaje]
        );

        // Si el admin responde y estaba 'Pendiente', pasa automáticamente a 'En proceso'
        if (remitente === 'admin' && reporte[0].estado === 'Pendiente') {
            await pool.query(
                "UPDATE reportes_soporte SET estado = 'En proceso' WHERE id = ?",
                [reporte_id]
            );
        } else {
            // Actualizar timestamp para que suba en la lista de recientes
            await pool.query(
                'UPDATE reportes_soporte SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?',
                [reporte_id]
            );
        }

        res.status(201).json({ message: 'Mensaje enviado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar el mensaje' });
    }
};

// 5. GET: Obtener TODOS los tickets para el panel Web del Administrador
export const getReportesAdmin = async (req, res) => {
    try {
        const query = `
            SELECT r.*, u.nombre, u.email 
            FROM reportes_soporte r 
            JOIN usuarios u ON r.usuario_id = u.id 
            ORDER BY FIELD(r.estado, 'Pendiente', 'En proceso', 'Resuelto'), r.fecha_actualizacion DESC
        `;
        const [reportes] = await pool.query(query);
        res.status(200).json(reportes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener todos los reportes' });
    }
};

// 6. PATCH: Cambiar el estado de un reporte desde la Web Admin ('Pendiente', 'En proceso', 'Resuelto')
export const cambiarEstadoReporte = async (req, res) => {
    try {
        const { reporte_id } = req.params;
        const { estado } = req.body;

        if (!['Pendiente', 'En proceso', 'Resuelto'].includes(estado)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }

        await pool.query(
            'UPDATE reportes_soporte SET estado = ? WHERE id = ?',
            [estado, reporte_id]
        );

        res.status(200).json({ message: `Reporte marcado como ${estado}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el estado del reporte' });
    }
};