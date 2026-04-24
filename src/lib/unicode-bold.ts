const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const bold = "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵";

export function toUnicodeBold(text: string): string {
  return text
    .split("")
    .map((char) => {
      const index = normal.indexOf(char);
      return index === -1 ? char : bold[index];
    })
    .join("");
}

export function boldPhrases(content: string, phrases: string[]): string {
  let result = content;
  for (const phrase of phrases) {
    if (!phrase?.trim()) continue;
    result = result.replace(phrase, toUnicodeBold(phrase));
  }
  return result;
}
