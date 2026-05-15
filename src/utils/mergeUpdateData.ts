export function mergeUpdateData<T extends Record<string, any>>(newData: Partial<T>, oldData: T): Partial<T> {
  const result: Partial<T> = {};

  for (const key in newData) {
    const value = newData[key];

    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}
