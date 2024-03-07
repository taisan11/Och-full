export function subjectpaser(subjecttxt: string): { [key: string]: [string, string] } {
  const lines: string[] = subjecttxt.split('\n');
  const result: { [key: string]: [string, string] } = {};
  for (const line of lines) {
    const match = line.match(/^(\d+)\.dat<>(.+) \((\d+)\)$/);
    if (match) {
      const [_, unixtime, threadName, responseCount] = match;
      result[`${unixtime}`] = [threadName, responseCount];
    } else {
      throw new Error('Invalid format');
    }
  }
  return result;
}