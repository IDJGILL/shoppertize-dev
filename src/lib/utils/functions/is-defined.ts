export const isDefined = (text: string | null | undefined) => {
  return text !== null || text !== undefined || text !== '';
};
