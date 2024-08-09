export const warpFetch = (
  path: string,
  init?: RequestInit,
) => {
  return fetch(`http://localhost:8000/${path}`, init);
};
