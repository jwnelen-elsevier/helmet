const truncate = (str, maxLetters) => {
  return str.length > maxLetters ? str.substring(0, maxLetters) + "..." : str;
};

export const getDateString = (date) => {
  let d = new Date(date);
  // by setting the locale, we are not getting the hydration error of Nextjs.
  return `${d.toLocaleTimeString("nl-NL")}`;
};

export const maxDecimals = (number, maxDecimals) => {
  if (number === undefined || number === null || isNaN(number)) {
    return "N/A";
  }
  return number.toFixed(maxDecimals);
};

export const removeSpecialChars = (word) => {
  return word.replaceAll(/#/g, "").replaceAll(/Ġ/g, "").replaceAll("Ċ", "_");
};
