export const warpFetch = (
  path: string,
  init?: RequestInit & {
    client: Deno.HttpClient;
  },
) => {
  return fetch(`http://localhost:8000/${path}`, init);
};
