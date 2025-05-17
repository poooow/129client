/**
 * Returns true if any of the strings in the array contain a vowel followed by 
 * an X followed by a vowel.
 *
 * Might be implemented more efficiently without regex by using a state machine. 
 * However, regex is very similar logic to the state machine so the performance 
 * difference is negligible.
 */
export default function vowelFilter(data: string[] | undefined) {
  if (!data) return false;

  const containsXbetweeenVowels = data.find((item) => {
    const vowels = ["a", "e", "i", "o", "u"];
    const regex = new RegExp(
      `[${vowels.join("")}].*[X].*[${vowels.join("")}]`,
      "g"
    );
    return !!item.match(regex);
  });

  return !!containsXbetweeenVowels;
}
