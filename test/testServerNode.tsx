import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import BBS from '../src/BBS';
import { serve } from '@hono/node-server'
import TBS from "../src/TBS";


declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, props: { title?: string }): Response
  }
}

const app = new Hono();

app.get(
  "*",
  jsxRenderer(({ children, title }) => {
    return (
      <html lang="ja">
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>{title}</title>
        </head>
        <body>{children}</body>
      </html>
    );
  }),
);
app.notFound((c) => {
  return c.render(
    <>
      <h1>404</h1>
    </>,
    { title: "404" },
  );
});
app.onError((e, c) => {
  return c.render(
    <>
      <h1>error</h1>
      <p> {e.message}</p>
    </>,
    { title: "error" },
  );
});

app.get("/", (c) => {
  return c.render(
    <>
      <h2>Och</h2>
      <p>0ではない。Oな掲示板を</p>
      <p>デバッグ用鯖です。便利だからと言って多用しすぎないように</p>
      <p>バグがあっても最低限のもの以外直しません</p>
      <a href="./test/read.cgi/test">テスト板</a><br />
      <a href="./mobtest/read.cgi/test">デザインテスト</a>
    </>,
    { title: "Och" },
  );
});

app.route("/test", BBS);
app.route("/mobtest", TBS);

serve(app)
