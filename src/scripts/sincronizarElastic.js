// Script inicial para sincronizar todas las noticias de la base de datos con Elasticsearch
import { pool } from '../config/db.js';
import { indexarNoticia } from '../services/elasticService.js';

const popularElastic = async () => {
  try {
    const [noticias] = await pool.query('SELECT * FROM noticias');
    console.log(`Cargando ${noticias.length} noticias a Elasticsearch...`);

    for (const noticia of noticias) {
      await indexarNoticia(noticia);
    }

    console.log('¡Sincronización completada con éxito!');
    process.exit(0);
  } catch (error) {
    console.error('Error al sincronizar:', error);
    process.exit(1);
  }
};

popularElastic();