import { spawn } from 'child_process';
import path from 'path';
import process from 'process';

const rootDir = process.cwd();

function start(cmd, args, opts) {
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    shell: false,
    ...opts,
  });
  return child;
}

const serverEntry = path.join(rootDir, 'server', 'index.js');
const viteBin = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

const serverProc = start(process.execPath, [serverEntry], { env: process.env });
const clientProc = start(process.execPath, [viteBin], { env: process.env });

function shutdown() {
  if (serverProc && !serverProc.killed) serverProc.kill();
  if (clientProc && !clientProc.killed) clientProc.kill();
}

process.on('SIGINT', () => {
  shutdown();
  process.exit(0);
});

serverProc.on('exit', (code) => {
  if (code !== 0) shutdown();
});

clientProc.on('exit', (code) => {
  if (code !== 0) shutdown();
});

