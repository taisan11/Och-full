export function subjectpaser(subjecttxt: string) {
  const match = subjecttxt.match(/^(\d+)\.dat<>(.+) \((\d+)\)$/);
  if (match) {
    const [_, unixtime, threadName, responseCount] = match;
    const result = {
      [`${unixtime}`]: [threadName, responseCount],
    };
    return result;
  } //else {
  //     throw new Error('Invalid format');
  // }
}
