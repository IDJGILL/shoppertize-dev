export const encodeVariableIds = (parentId: string, variationId: string) => {
  const base64String = btoa(`${parentId}:${variationId}`);

  return base64String;
};
