export const warpFetch = (
  path: string,
  init?: RequestInit,
) => {
  return fetch(`http://localhost:8000/${path}`, init);
};

export const loadData = async <T extends object>(path: string): Promise<T> => {
  const res = await warpFetch(path);
  return await res.json();
};
