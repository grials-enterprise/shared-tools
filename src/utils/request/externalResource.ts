import httpClient, { AxiosResponse, RawAxiosRequestHeaders } from 'axios';

/**
 * Map of header names to header values.
 *
 * @category Async & HTTP
 */
export type AxiosHeaders = {
  [key: string]: string;
};

/**
 * Performs a `GET` request to an external resource.
 *
 * @param url - Target URL.
 * @param headers - Optional request headers.
 * @param params - Optional query parameters.
 * @param logger - Optional logger with `info` and `error` methods.
 * @returns The Axios response.
 * @throws The Axios error when the request fails.
 *
 * @category Async & HTTP
 */
export const getExternalResource = async (
  url: string,
  headers: RawAxiosRequestHeaders | AxiosHeaders = {},
  params?: any,
  logger?: any
): Promise<AxiosResponse<any>> => {
  logger?.info(`get external resource | ${url}`);
  try {
    return await httpClient.get(url, { headers: { ...(headers || {}) }, params: params || {} });
  } catch (error) {
    logger?.error(error);
    throw error;
  }
};

/**
 * Performs a `POST` request to an external resource.
 *
 * @param url - Target URL.
 * @param data - Request body.
 * @param headers - Optional request headers.
 * @param params - Optional query parameters.
 * @param logger - Optional logger with `info` and `error` methods.
 * @returns The Axios response.
 * @throws The Axios error when the request fails.
 *
 * @category Async & HTTP
 */
export const postExternalResource = async (
  url: string,
  data: any,
  headers: RawAxiosRequestHeaders | AxiosHeaders = {},
  params?: any,
  logger?: any
): Promise<AxiosResponse<any>> => {
  logger?.info(`post external resource | ${url}`);
  try {
    return await httpClient.post(url, data, { headers: { ...(headers || {}) }, params: params || {} });
  } catch (error) {
    logger?.error(error);
    throw error;
  }
};

/**
 * Performs a `PATCH` request to an external resource.
 *
 * @param url - Target URL.
 * @param data - Request body.
 * @param headers - Optional request headers.
 * @param params - Optional query parameters.
 * @param logger - Optional logger with `info` and `error` methods.
 * @returns The Axios response.
 * @throws The Axios error when the request fails.
 *
 * @category Async & HTTP
 */
export const patchExternalResource = async (
  url: string,
  data: any,
  headers: RawAxiosRequestHeaders | AxiosHeaders = {},
  params?: any,
  logger?: any
): Promise<AxiosResponse<any>> => {
  logger?.info(`patch external resource | ${url}`);
  try {
    return await httpClient.patch(url, data, { headers: { ...(headers || {}) }, params: params || {} });
  } catch (error) {
    logger?.error(error);
    throw error;
  }
};

/**
 * Performs a `DELETE` request to an external resource.
 *
 * @param url - Target URL.
 * @param data - Request body.
 * @param headers - Optional request headers.
 * @param params - Optional query parameters.
 * @param logger - Optional logger with `info` and `error` methods.
 * @returns The Axios response.
 * @throws The Axios error when the request fails.
 *
 * @category Async & HTTP
 */
export const deleteExternalResource = async (
  url: string,
  data: any,
  headers: RawAxiosRequestHeaders | AxiosHeaders = {},
  params?: any,
  logger?: any
): Promise<AxiosResponse<any>> => {
  logger?.info(`delete external resource | ${url}`);
  try {
    return await httpClient.delete(url, { data, headers: { ...(headers || {}) }, params: params || {} });
  } catch (error) {
    logger?.error(error);
    throw error;
  }
};
