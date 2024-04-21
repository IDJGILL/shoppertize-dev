export const decodeVariableIds = (id: string) => {
  const ids = atob(id);

  const parentId = ids.split(":")[0]!;
  const variationId = ids.split(":")[1]!;

  return {
    parentId,
    variationId,
  };
};
