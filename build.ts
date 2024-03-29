async function main() {
  console.log("Building...")
  const BBS = Bun.file('./src/BBS.tsx')
  const TBS = Bun.file('./src/TBS.tsx')
  const KAS = Bun.file('./src/KAS.ts')
  const subjectpaser = Bun.file('./src/subjectpaser.ts')
  const kakiko = Bun.file('./src/kakiko.ts')
  const datparser = Bun.file('./src/datparser.ts')
  const newBBS = Bun.file("./dist/BBS.tsx");
  const newTBS = Bun.file("./dist/TBS.tsx");
  const newKAS = Bun.file("./dist/KAS.ts");
  const newSubjectpaser = Bun.file("./dist/subjectpaser.ts");
  const newKakiko = Bun.file("./dist/kakiko.ts");
  const newDatparser = Bun.file("./dist/datparser.ts");
  console.log("Writing...")
    await Bun.write(newBBS, BBS);
    await Bun.write(newTBS, TBS);
    await Bun.write(newKAS, KAS);
    await Bun.write(newSubjectpaser, subjectpaser);
    await Bun.write(newKakiko, kakiko);
    await Bun.write(newDatparser, datparser);
    console.log("Build done!")
}

main()