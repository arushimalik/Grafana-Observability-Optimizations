function trimFileName(fileName) {
  const nameLength = 16;
  const delimiter = fileName.lastIndexOf(".");
  const extension = fileName.substring(delimiter);
  const file = fileName.substring(0, delimiter);
  if (file.length < nameLength) {
    return fileName;
  }
  return `${file.substring(0, nameLength)}...${extension}`;
}

export { trimFileName };
//# sourceMappingURL=file.js.map
