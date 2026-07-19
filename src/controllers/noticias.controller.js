import { pool } from '../config/db.js';

// Obtener todas las noticias
export const getAllNoticias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM noticias ORDER BY fecha_publicacion DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las noticias' });
    }
};

// Obtener una noticia por ID
export const getNoticiaById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM noticias WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Noticia no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la noticia' });
    }
};

// Crear una nueva noticia
export const createNoticia = async (req, res) => {
    const { titulo, contenido, categoria, destacada } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO noticias (titulo, contenido, categoria, destacada) VALUES (?, ?, ?, ?)',
            [titulo, contenido, categoria, destacada || false]
        );
        res.status(201).json({ id: result.insertId, titulo, contenido, categoria, destacada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la noticia' });
    }
};

// Actualizar una noticia existente
export const updateNoticia = async (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, categoria, destacada } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE noticias SET titulo = ?, contenido = ?, categoria = ?, destacada = ? WHERE id = ?',
            [titulo, contenido, categoria, destacada, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Noticia no encontrada' });
        res.json({ message: 'Noticia actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la noticia' });
    }
};

// Eliminar una noticia
export const deleteNoticia = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM noticias WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Noticia no encontrada' });
        res.json({ message: 'Noticia eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la noticia' });
    }
};