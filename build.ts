await Bun.build({
    entrypoints: ['./src/index.tsx'],
    outdir: './dist',
    target: 'bun',
    minify: true,
  });