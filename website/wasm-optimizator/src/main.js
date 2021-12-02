import { run } from './server.js';
import { config } from 'dotenv';

config();

run(5000); //process.env.PORT);
