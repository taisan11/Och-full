import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

setInterval(async () => {
    // 定期的に実行するコード
    console.log("clearing dat");
    const storage = createStorage({driver: fsDriver({ base: "./data" }),});
    const SUB = await storage.getItem("/test/SUBJECT.TXT");
    
}, 600000);//最後の数字はミリ秒