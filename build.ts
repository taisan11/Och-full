import {build} from 'esbuild';
import {dependencies} from './package.json';
async function Build(args: string[]) {
  switch (args[2]) {
    case 'cloudflare':
      await Bun.build({
        entrypoints: ['./src/index.tsx'],
        outdir: './dist-cf',
        target: 'node',
        minify: true,
      });
      break;
    default:
      build({
        bundle: true,
        entryPoints: ['./src/BBS.tsx', './src/TBS.tsx'],
        logLevel: 'info',
        sourcemap: true,
        format: 'esm',
        outdir: './dist',
        target: ['ES6'],
      })
      break;
}
}

Build(Bun.argv)