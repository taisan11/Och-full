# Och-multi

Och-multiはマルチランタイムで動くようにしたOchです。
メインの処理はBBS.tsxにあり、/testにmountすると2chとほぼ同じように動作します。
唯一動作しないのは/BBS名です。この掲示板では2chでいう/testよりしたの部分のみ再現する予定です
## サポートランタイム
サーバーランタイム
- Node
- Bun
- Deno
エッジランタイム
- Cloudflare Workers
- Cloudflare Pages
- Fastly Compute
- Vercel
- AWS Lambda
- Lambda@Edge
- Other
## 貢献方法
### 環境構築
```bash
bun i
bun run create:test
bun run dev
```
を実行するとデバック用サーバーが起動します。
