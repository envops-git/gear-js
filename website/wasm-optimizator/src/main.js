import { run } from './server';
import { config } from 'dotenv';

config();

run(process.env.PORT);
