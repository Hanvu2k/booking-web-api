function removeAccents(str) {
  const accents = [
    /[\u00c0-\u00c5]/g, // A
    /[\u00c8-\u00cb]/g, // E
    /[\u00cc-\u00cf]/g, // I
    /[\u00d2-\u00d6]/g, // O
    /[\u00d9-\u00dc]/g, // U
    /[\u00e0-\u00e5]/g, // a
    /[\u00e8-\u00eb]/g, // e
    /[\u00ec-\u00ef]/g, // i
    /[\u00f2-\u00f6]/g, // o
    /[\u00f9-\u00fc]/g, // u
    /[\u00f1]/g, // n
    /[\u00d1]/g, // N
  ];

  const replacements = [
    "A",
    "E",
    "I",
    "O",
    "U",
    "a",
    "e",
    "i",
    "o",
    "u",
    "n",
    "N",
  ];

  for (let i = 0; i < accents.length; i++) {
    str = str.replace(accents[i], replacements[i]);
  }

  return str;
}

module.exports.convertVietnameseInputs = (text) => {
  const words = text.split(" ");
  const convertedWords = words.map((word) => removeAccents(word));
  return convertedWords.join(" ");
};
