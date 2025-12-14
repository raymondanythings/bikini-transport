import ky, { type Options } from 'ky';

const instance = ky.create({
  prefixUrl: 'http://localhost:5173/api',
});

export const http = {
  get: <T>(url: string, options?: Options) => instance.get(url, options).json<T>(),
  post: <T, B = unknown>(url: string, body: B, options?: Options) =>
    instance.post(url, { json: body, ...options }).json<T>(),
  put: <T, B = unknown>(url: string, body: B, options?: Options) =>
    instance.put(url, { json: body, ...options }).json<T>(),
  delete: <T, B = unknown>(url: string, body: B, options?: Options) =>
    instance.delete(url, { json: body, ...options }).json<T>(),
};
