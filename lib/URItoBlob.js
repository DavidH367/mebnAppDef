export const dataURItoBlob = (dataURI) => {
  const byteString = Buffer.from(dataURI.split(",")[1], "base64");
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const blob = new Blob([byteString], { type: mimeString });
  return blob;
};