import { Hono } from 'hono'
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import { subjectpaser } from './subjectpaser';

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

app.get('/', async (c) => {
return c.render(
    <>
    <h1>hello</h1>
    <p>このサイトはBBS.TSXスクリプトを利用しています</p>
    <p>まぁいいか</p>
    <form method="post">
        <input type="hidden" name="bbs" value="testing"/>
        <div style="display: flex;">
        <label htmlFor="thTi">スレタイ:</label>
        <input type="text" id="thTi" name="thTi" />
        <button type="submit">新規スレッド作成</button><br />
        </div>
        <div style="display: flex;;">
        <label htmlFor="name">名前</label>
        <input type="text" id="name" name="name" />
        <label htmlFor="mail">メール(省略可)</label>
        <input type="text" id="mail" name="mail" /><br />
        </div>
        <textarea rows="5" cols="70" name="MESSAGE"/>
    </form>
    </>,{ title: 'Hello' })
})

app.get('/read.cgi/:BBSKEY', async (c) => {
    const BBSKEY = c.req.param('BBSKEY')
    console.debug(BBSKEY)
    const storage = createStorage({driver: fsDriver({ base: "./data" }),});
    const SUBJECTTXT = await storage.getItem(`/${BBSKEY}/SUBJECT.TXT`);
    console.debug(SUBJECTTXT)
    if (!SUBJECTTXT) {
        return c.render(
            <>
            <h1>READ.CGI for BBS.TSX by Och</h1>
            <p>掲示板がありません</p>
            </>,{ title: '掲示板がない' })
    }
    const SUBJECTJSON = subjectpaser(SUBJECTTXT.toString())
    return c.render(
        <>
        <h1>READ.CGI</h1>
        {Object.entries(SUBJECTJSON).map(([filename, [threadName, responseCount]]) => {
        const unixTime = filename.split('.')[0];
        const date = new Date(unixTime * 1000);
        const formattedDate = `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
        return (
          <a href={`./${filename}`}>{`${threadName}-${responseCount}-${formattedDate}`}</a>
        );
        })}
        </>,{ title: 'READ.CGI' })
})

export default app