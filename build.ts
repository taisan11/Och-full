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
      await Bun.build({
        entrypoints: ['./src/index.tsx'],
        outdir: './dist',
        target: 'bun',
        minify: true,
      });
      break;
}
}

Build(Bun.argv)