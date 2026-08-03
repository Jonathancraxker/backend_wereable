import { elasticClient } from '../config/elastic.js';

const INDEX_NAME = 'noticias';

// Función para indexar una noticia
export const indexarNoticia = async (noticia) => {
  try {
    await elasticClient.index({
      index: INDEX_NAME,
      id: noticia.id.toString(),
      document: {
        id: noticia.id,
        titulo: noticia.titulo,
        contenido: noticia.contenido,
        categoria: noticia.categoria,
        imagen: noticia.imagen,
        fecha_publicacion: noticia.fecha_publicacion
      }
    });
    await elasticClient.indices.refresh({ index: INDEX_NAME });
  } catch (error) {
    console.error('Error al indexar en Elasticsearch:', error);
  }
};

// Función para buscar en Elasticsearch
export const buscarNoticiasElastic = async (query) => {
  try {
    const response = await elasticClient.search({
      index: INDEX_NAME,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['titulo^3', 'contenido'], 
            fuzziness: 'AUTO'
          }
        }
      }
    });

    return response.hits.hits.map(hit => hit._source);
  } catch (error) {
    console.error('Error en búsqueda de Elasticsearch:', error);
    return [];
  }
};