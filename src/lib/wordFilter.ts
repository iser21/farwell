const BANNED_WORDS = [
  "fuck", "shit", "ass", "bitch", "damn", "crap", "dick", "bastard",
  "slut", "whore", "idiot", "stupid", "dumb", "hate", "kill", "die",
];

export function containsBannedWords(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_WORDS.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(lower);
  });
}
