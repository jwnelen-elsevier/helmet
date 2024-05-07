const truncate = (str, maxLetters) => {
  return str.length > maxLetters ? str.substring(0, maxLetters) + "..." : str;
};

export const getTimeString = (date) => {
  let d = new Date(date);
  return `${d.toLocaleTimeString("nl-NL")}`;
};

export const getDateString = (date) => {
  let d = new Date(date);
  return `${d.toLocaleDateString("nl-NL")}`;
};

export const maxDecimals = (number, maxDecimals) => {
  if (number === undefined || number === null || isNaN(number)) {
    return "N/A";
  }
  return number.toFixed(maxDecimals);
};

export const toPercentageString = (number, decimals = 2) => {
  const n = maxDecimals(number * 100, decimals);
  return `${n}%`;
};

export const removeSpecialChars = (word) => {
  const stripped = word
    ?.replaceAll(/#/g, "")
    ?.replaceAll(/Ġ/g, "")
    ?.replaceAll("Ċ", "")
    ?.replaceAll("▁", "");
  // if stripped is empty, return "_"
  return stripped === "" ? "_" : stripped;
};

function isNumber(str) {
  return /^[0-9]+$/.test(str);
}

export const isNewWord = (word) => {
  if (isNumber(word)) return false;
  if (word.split("").includes(["Ġ", "_", "▁"])) return true;
  debugger;
  return !word
    .split("")
    .includes([",", "!", ".", "?", ":", ";", "'", "$", "##"]);
};

export const marginStyle = (word) => {
  if (!word) {
    return { trimmedWord: "", addSpace: false };
  }

  const addSpace = isNewWord(word);
  let trimmedWord = removeSpecialChars(word);

  return { trimmedWord, addSpace };
};
