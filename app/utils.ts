export const uuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * https://mariusschulz.com/blog/keyof-and-lookup-types-in-typescript
 * @param obj
 * @param key
 */
export function getProperty<T>(obj: any, key: any): T | null {
  return key in obj ? obj : null;
}
