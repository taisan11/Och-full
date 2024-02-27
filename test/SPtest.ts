import { subjectpaser } from "../src/subjectpaser";
import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

console.debug('test')
const storage = createStorage({driver: fsDriver({ base: "./data" }),});
const SUBJECTTXT = await storage.getItem(`/test/SUBJECT.TXT`);
console.debug('subjectpaser:',subjectpaser('1662626407.dat<>★テスト (6)'))