import { Hono } from 'hono'
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'

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
app.notFound((c) => {
  return c.render(
    <>
      <h1>404</h1>
      <p>ぺーじがないよ!!</p>
    </>
  , { title: '404' }
  )
})
app.onError((e, c) => {
  return c.render(<>
    <h1>えらー</h1>
    <p>お急ぎでしたら下記の怪文書を管理者に送り付けると直してくれるそうです</p>
    <p> {e.message}</p>
  </>, { title: 'えらー' })
})

app.get('/', (c) => {
  return c.render(
    <>
    <h2>Och</h2>
    <p>0ではない。Oな掲示板を</p>
    </>,{ title: 'Och' }
  )
})

app.get('/test/read.cgi/', (c) => {
  return c.render(
    <>
    <h2>test2</h2>
    <p>test</p>
    </>,{ title: 'test' }
  )
})

// READ.CGI //
app.get('/test/read.cgi/:board/:id', (c) => {
  const { board, id } = c.req.param()
  Bun.file(`./${board}/dat/${id}.dat`)
  return c.render(
    <>
    <h2>{board}</h2>
    <p>{id}</p>
    </>,{ title: 'test' }
  )
})

export default app
