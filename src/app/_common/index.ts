const getMapper = (
  array: string[],
  predicate = true
): Record<string, boolean> => {
  return array.reduce((acc, curr) => ({ ...acc, [curr]: predicate }), {});
};

export { getMapper };
