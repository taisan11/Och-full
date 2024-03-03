import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import { datpaser } from "./datpaser";
import { subjectpaser } from "./subjectpaser";
import { KAS } from "./KAS";

declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props: { title?: string }): Response;
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

app.get("/", async (c) => {
  return c.render(
    <>
      <h1>hello</h1>
      <p>このサイトはBBS.TSXスクリプトを利用しています</p>
      <p>まぁいいか</p>
      <form method="post">
        <input type="hidden" name="bbs" value="testing" />
        <div style="display: flex;">
          <label htmlFor="thTi">スレタイ:</label>
          <input type="text" id="thTi" name="thTi" />
          <button type="submit">新規スレッド作成</button>
          <br />
        </div>
        <div style="display: flex;;">
          <label htmlFor="name">名前</label>
          <input type="text" id="name" name="name" />
          <label htmlFor="mail">メール(省略可)</label>
          <input type="text" id="mail" name="mail" />
          <br />
        </div>
        <textarea rows="5" cols="70" name="MESSAGE" />
      </form>
    </>,
    { title: "Hello" },
  );
});

app.get("/read.cgi/:BBSKEY", async (c) => {
  const BBSKEY = c.req.param("BBSKEY");
  console.debug(BBSKEY);
  const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
  const SUBJECTTXT = await storage.getItem(`/${BBSKEY}/SUBJECT.TXT`);
  console.debug(SUBJECTTXT);
  if (!SUBJECTTXT) {
    return c.render(
      <>
        <h1>READ.CGI for BBS.TSX by Och</h1>
        <p>掲示板がありません</p>
      </>,
      { title: "掲示板がない" },
    );
  }
  const SUBJECTJSON = subjectpaser(SUBJECTTXT.toString());
  return c.render(
    <>
      <h1>READ.CGI</h1>
      {Object.entries(SUBJECTJSON).map(
        ([filename, [threadName, responseCount]]) => {
          const unixTime = filename.split(".")[0];
          const date = new Date(unixTime * 1000);
          const formattedDate = `${date.getFullYear()}/${(
            "0" +
            (date.getMonth() + 1)
          ).slice(-2)}/${("0" + date.getDate()).slice(-2)}`;
          return (
            <a href={`./${BBSKEY}/${filename}`}>{`${threadName}-${responseCount}-${formattedDate}`}</a>
          );
        },
      )}
      <p>スレ作成</p>
      <form method="post">
        <input type="hidden" name="bbs" value="testing" />
        <label htmlFor="thTi">スレタイ:</label>
        <input type="text" id="thTi" name="thTi" />
        <button type="submit">新規スレッド作成</button>
        <br />
        <label htmlFor="name">名前</label>
        <input type="text" id="name" name="name" />
        <label htmlFor="mail">メール(省略可)</label>
        <input type="text" id="mail" name="mail" />
        <br />
        <textarea rows="5" cols="70" name="MESSAGE" />
      </form>
      <br />
      <br />
      <p>READ.CGI for BBS.TSX by Och BBS β</p>
    </>,
    { title: "READ.CGI" },
  );
});

////////////////////////
//   ##現在の仕様のコーナー
//   現在はですね、IPを方法がないので放置です
//   いつか実装したいです
////////////////////////

app.post("/read.cgi/:BBSKEY/:THID", async (c) => {
  const body = await c.req.parseBody()
  const body2 = await c.req.formData();
  console.log(body)
  console.log(body2)
  console.log("title:", body2.get("name"));
  console.log("content:", body2.get("mail"));
  console.log(c.req.raw)
  console.log(c.req.parseBody())
  const Name = String(body.name);//名前
  const mail = String(body.mail);//メアドor色々
  const MESSAGE = String(body.MESSAGE);//内容
  const BBSKEY = c.req.param("BBSKEY");//BBSKEY
  const THID = c.req.param("THID");//スレID
  const date = new Date();//時間
  const UnixTime = String(date.getTime()).substring(0, 10)//UnixTime
  const IP = c.req.header('CF-Connecting-IP')//IP(cloudflare tunnel使えば行けるやろ)
  const storage = createStorage({driver: fsDriver({ base: "./data" }),});
  const KASS = await KAS(MESSAGE,Name,mail,Number(UnixTime));
  const THDATTXT = await storage.getItem(`/${BBSKEY}/dat/${THID}.dat`);
  await storage.setItem(`/${BBSKEY}/dat/${THID}.dat`, `${THDATTXT}\n${KASS.name}<>${KASS.mail}<>${KASS.time}<>${MESSAGE}`);
  return c.redirect(`/test/read.cgi/${BBSKEY}/${THID}`);
});

app.get("/read.cgi/:BBSKEY/:THID", async (c) => {
  const BBSKEY = c.req.param("BBSKEY");
  const THID = c.req.param("THID");
  const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
  const THDATTXT = await storage.getItem(`/${BBSKEY}/dat/${THID}.dat`);
  if (!THDATTXT) {
    return c.render(
      <>
        <h1>READ.CGI for BBS.TSX by Och</h1>
        <p>スレッドがありません</p>
      </>,
      { title: "スレッドがない" },
    );
  }
  const EXAS = `../${BBSKEY}`;
  const DATJSON = JSON.parse(datpaser(THDATTXT.toString()));
  return c.render(
    <>
      <div style="margin:0px;">
        <div style="margin-top:1em;">
          <span style="float:left;">
            <a href={EXAS}>■掲示板に戻る■</a>眠たいね
          </span>
          <span style="float:right;"></span>&nbsp;
        </div>
      </div>
      <hr style="background-color:#888;color:#888;border-width:0;height:1px;position:relative;top:-.4em;" />
      <h1 style="color:#CC0000;font-size:larger;font-weight:normal;margin:-.5em 0 0;">
        {DATJSON.title}
      </h1>
      <dl class="thred">
        {DATJSON.post.map((post) => (
          <>
            <dt id={post.postid}>
              {post.postid} ：
              <font color="seagreen">
                <b>{post.name}</b>
                <b>{post.mail}</b>
              </font>
              ：{post.date}
            </dt>
            <dd dangerouslySetInnerHTML={{ __html: post.message }} />
          </>
        ))}
      </dl>
      <form method="post">
        <button type="submit">書き込む</button>
        <label htmlfor="name">名前:</label>
        <input type="text" id="name" name="name" />
        <label htmlfor="mail">メール(省略可):</label>
        <input type="text" id="mail" name="mail" /><br />
        <textarea rows="5" cols="70" name="MESSAGE"></textarea>
      </form>
      <br />
      <br />
      <p>READ.CGI for BBS.TSX by Och BBS β</p>
    </>,
    { title: "READ.CGI" },
  );
});

export default app;
