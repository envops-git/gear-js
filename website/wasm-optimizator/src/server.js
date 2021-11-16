import express from 'express';
import { optimize } from './wasm-proc';

export const run = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.post('/', async (req, res) => {
    const wasm = req.body.wasm;
    const name = req.body.name;
    const resultZip = await optimize(wasm, name);
    res.json({
      result: resultZip,
    });
  });
};
