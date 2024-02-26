import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

const testSUBJECT = `
1662626407.dat<>★テスト (6)
`

const storage = createStorage(fsDriver({ base: './data' }))
storage.setItem('/test/SUBJECT.TXT', testSUBJECT)