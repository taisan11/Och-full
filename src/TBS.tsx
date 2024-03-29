import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import { datpaser } from "./datpaser";
import { subjectpaser } from "./subjectpaser";
import { kakiko } from "./kakiko";
import {css,Style} from "hono/css";

declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props: { title?: string }): Response;
  }
}

const app = new Hono();

const mainCss = css`
display: flex;
`

app.get(
  "*",
  jsxRenderer(({ children, title }) => {
    return (
      <html lang="ja">
        <head>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"></link>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <Style/>
          <title>{title}</title>
        </head>
        <body>{children}</body>
      </html>
    );
  }),
);

app.get("/test/read.cgi/error", async (c) => {
  const e = c.req.query("e");
  let em = "";
  switch (e) {
    case "0":
      em = "名前が入力されていないか、30文字を超えています";
      break;
    case "1":
      em = "内容が入力されていないか、300文字を超えています";
      break;
    case "2":
      em = "メールが70文字を超えています";
      break;
    case "3":
      em = "BBSKEYがありません";
      break;
    case "4":
      em = "THIDがありません";
      break;
    case "5":
      em = "スレタイが入力されていません";
      break;
  }
  return c.render(
    <>
      <h1>ERROR</h1>
      <p>えらーがきたぞー</p>
      <p>{em}</p>
    </>,
    { title: "ERROR" },
  );
})


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

app.post("/read.cgi/:BBSKEY", async (c) => {
  const kextuka = await kakiko(c, "newth",'mobtest');
  return c.redirect(kextuka.redirect);
});

app.get("/read.cgi/:BBSKEY", async (c) => {
  const BBSKEY = c.req.param("BBSKEY");
  const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
  const SUBJECTTXT = await storage.getItem(`/${BBSKEY}/SUBJECT.TXT`);
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
      {
        Object.entries(SUBJECTJSON).map(([unixtime, [threadName, responseCount]]) => {
          const date = new Date(parseInt(unixtime) * 1000);
          const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
          return (
            <><a href={`./${BBSKEY}/${unixtime}`}>{`${threadName}-${responseCount}-${formattedDate}`}</a><br/></>
          );
        })
      }
      <p>スレ作成</p>
      <form method="post">
        <div class={mainCss}>
        <input type="hidden" name="bbs" value="testing" />
        <label htmlFor="thTi">スレタイ:</label>
        <input type="text" id="thTi" name="thTi" />
        <button type="submit">新規スレッド作成</button>
        </div>
        <div class={mainCss}>
        <label htmlFor="name">名前</label>
        <input type="text" id="name" name="name" />
        <label htmlFor="mail">メール(省略可)</label>
        <input type="text" id="mail" name="mail" />
        </div>
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
  const kextuka = await kakiko(c, "kakiko",'mobtest');
  return c.redirect(kextuka.redirect);
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
        {//@ts-ignore
        DATJSON.post.map((post) => (
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
        <div class={mainCss}>
        <button type="submit">書き込む</button>
        <label htmlfor="name">名前:</label>
        <input type="text" id="name" name="name" />
        <label htmlfor="mail">メール(省略可):</label>
        <input type="text" id="mail" name="mail" />
        </div>
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
