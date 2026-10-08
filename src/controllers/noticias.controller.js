import { pool } from '../config/db.js';
import { indexarNoticia } from '../services/elasticService.js';

// Obtener todas las noticias (HACEMOS JOIN PARA TRAER EL NOMBRE DEL AUTOR)
export const getAllNoticias = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT n.*, u.nombre AS nombre_autor 
            FROM noticias n 
            LEFT JOIN usuarios u ON n.autor_id = u.id 
            ORDER BY n.id DESC
        `);
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
        const [rows] = await pool.query(`
            SELECT n.*, u.nombre AS nombre_autor 
            FROM noticias n 
            LEFT JOIN usuarios u ON n.autor_id = u.id 
            WHERE n.id = ?
        `, [id]);
        
        if (rows.length === 0) return res.status(404).json({ message: 'Noticia no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la noticia' });
    }
};

// Crear una nueva noticia (GUARDAMOS EL AUTOR_ID)
export const createNoticia = async (req, res) => {
    const { titulo, contenido, categoria, destacada, imagen, autor_id } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO noticias (titulo, contenido, categoria, destacada, imagen, autor_id) VALUES (?, ?, ?, ?, ?, ?)',
            [titulo, contenido, categoria, destacada || false, imagen, autor_id || null]
        );
        // Indexar la noticia en Elasticsearch
        const nuevaNoticia = {
            id: result.insertId,
            titulo,
            contenido,
            categoria,
            destacada: destacada || false,
            imagen,
            autor_id
        };
        await indexarNoticia(nuevaNoticia);
        res.status(201).json({ message: 'Noticia creada correctamente', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la noticia' });
    }
};

// Actualizar una noticia existente
export const updateNoticia = async (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, categoria, destacada, imagen } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE noticias SET titulo = ?, contenido = ?, categoria = ?, destacada = ?, imagen = ? WHERE id = ?',
            [titulo, contenido, categoria, destacada, imagen, id]
        );
        // Indexar la noticia actualizada en Elasticsearch
        const noticiaActualizada = {
            id,
            titulo,
            contenido,
            categoria,
            destacada,
            imagen
        };
        await indexarNoticia(noticiaActualizada);
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