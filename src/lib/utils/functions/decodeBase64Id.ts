export const decodeBase64Id = (base64Id: string) => {
  const decodedId = atob(base64Id);

  return decodedId.split(":")[1] ?? "";
};
