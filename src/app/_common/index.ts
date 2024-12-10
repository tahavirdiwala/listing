const getMapper = (
  array: string[],
  predicate = false
): Record<string, boolean> => {
  return array.reduce((acc, curr) => ({ ...acc, [curr]: predicate }), {});
};

export { getMapper };
