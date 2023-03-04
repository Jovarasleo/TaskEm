export default function deepCopy<T>(obj: T): T {
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map(deepCopy) as unknown as T;
    } else {
      const newObj: Partial<T> = {};
      for (const key in obj) {
        newObj[key] = deepCopy(obj[key]);
      }
      return newObj as T;
    }
  } else {
    return obj;
  }
}
