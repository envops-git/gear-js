import { exec } from 'child_process';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import AdmZip from 'adm-zip';

const path = {
  wasm: (name) => `/wasm-build/${name}.wasm`,
  opt: (name) => `/wasm-build/${name}.opt.wasm`,
  meta: (name) => `/wasm-build/${name}.meta.wasm`,
};

const rmAll = (name) => {
  rmSync(path.wasm(name));
  rmSync(path.meta(name));
  rmSync(path.opt(name));
};

/**
 *
 * @param {Buffer} wasm
 * @param {string} name
 */
export default async (wasm, name) => {
  name = name.replace('.wasm', '');
  writeFileSync(path.wasm(name), wasm);
  await new Promise((resolve, reject) => {
    exec(`wasm-proc -p ${path.wasm(name)}`, (_, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      resolve();
    });
  });
  const opt = readFileSync(path.opt(name));
  const meta = readFileSync(path.meta(name));
  rmAll(name);
  const zip = new AdmZip();
  zip.addFile(`${name}.opt.wasm`, Buffer.alloc(opt.length, opt));
  zip.addFile(`${name}.meta.wasm`, Buffer.alloc(meta.length, meta));
  return zip.toBuffer();
};
