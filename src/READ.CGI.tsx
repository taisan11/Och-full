import { Hono } from 'hono'
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import { createStorage } from "unstorage";

declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, props: { title?: string }): Response
  }
}

const app = new Hono()

app.get(
  '*',
  jsxRenderer(({ children,title }) => {
    return (
      <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </head>
      <body>
        {children}
      </body>
      </html>
    )
  })
)
app.get('/', (c) => {
return c.render(
    <h1>Hello READ.CGI.TSX</h1>,{ title: 'Hello' })
})

export default app