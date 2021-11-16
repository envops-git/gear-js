import { exec } from 'child_process';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import AdmZip from 'adm-zip';

const path = {
  wasm: (name) => `/wasm-build/${name}.wasm`,
  opt: (name) => `/wasm-build/${name}.opt.wasm`,
  meta: (name) => `/wasm-build/${name}.meta.wasm`,
  all: (name) => `/wasm-build/${name}*`,
};

/**
 *
 * @param {Buffer} wasm
 * @param {string} name
 */
export const optimize = async (wasm, name) => {
  name = name.replace('.wasm', '');
  const optName = writeFileSync(path.wasm(name), wasm);
  exec(`wasm-proc -p /wasm-build/${name}`, (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
  });
  const opt = readFileSync(path.opt(name));
  const meta = readFileSync(path.meta(name));
  rmSync(path.all(name));

  const zip = new AdmZip();
  zip.addFile(`${name}.opt.wasm`, Buffer.alloc(opt.length, opt));
  zip.addFile(`${name}.meta.wasm`, Buffer.alloc(meta.length, meta));
  return zip.toBuffer();
};
