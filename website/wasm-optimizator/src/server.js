import express from 'express';
import optimize from './wasm-proc.js';
import cors from 'cors';
import multer from 'multer';

const wasmFile = multer();

export const run = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.post('/', wasmFile.single('wasm'), async (req, res) => {
    const wasm = req.file.buffer;
    const name = req.file.originalname;
    const resultZip = await optimize(wasm, name);
    res.json({
      result: resultZip,
    });
  });

  app.listen(3003);
};
