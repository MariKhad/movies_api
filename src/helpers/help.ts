export function uniqueItems<T>(items: T[]): T[] {
  const result = items.reduce((acc: T[], item: T) => {
    if (acc.includes(item)) {
      return acc;
    }
    return [...acc, item];
  }, []);
  return result;
}

export function arrayToStringItems<T>(items: T[]): string[] {
  return items.map((item) => {
    return String(item);
  });
}

export function isTimeValid(date: number): boolean {
  return new Date(date).getTime() >= 0;
}
