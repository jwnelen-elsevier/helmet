const truncate = (str, maxLetters) => {
  return str.length > maxLetters ? str.substring(0, maxLetters) + "..." : str;
};
