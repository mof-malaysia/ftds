/** The first sentence, for places that only have room for one thought. */
export function firstSentence(text: string): string {
  const match = text.match(/^.+?[.!?](?=\s+[A-Z]|$)/);
  return (match ? match[0] : text).trim();
}
