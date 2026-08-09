import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();

const node = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
const apiKey = process.env.ELASTICSEARCH_API_KEY;

const clientOptions = { node };

if (apiKey) {
  clientOptions.auth = { apiKey };
}

export const elasticClient = new Client(clientOptions);

export default elasticClient;