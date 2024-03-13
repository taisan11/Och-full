import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

const app = new Hono();

app.get("*",jsxRenderer(({ children }) => {
        return (
    <html lang="ja">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>検索</title>
        </head>
        <body>{children}</body>
    </html>
        );
    }),
);

app.get("/", async (c) => {
    return c.render(
        <>
            <h1>検索</h1>
            <form action="/serch.cgi" method="POST">
                <input type="search" name="a" id="a" />
                <input type="submit" value="検索" />
            </form>
        </>,
        { title: "検索" },
    );
})
app.post("/", async (c) => {
    const form = await c.req.formData();
    const a = form.get("a");
    return c.render(
        <>
            <h1>検索</h1>
            <p>検索結果</p>
            <p>{a}</p>
        </>,
        { title: "検索" },
    );
})

export default app;