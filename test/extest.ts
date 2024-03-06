import * as KP from "@taisan11/kejibanhelper"
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

async function Wa() {
    const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
    const SUBJECTTXT = await storage.getItem(`/test/SUBJECT.TXT`);
    console.debug(SUBJECTTXT);
    console.debug(KP.SubjectPaser(SUBJECTTXT));
}
