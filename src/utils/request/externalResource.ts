import httpClient, { AxiosResponse, RawAxiosRequestHeaders } from 'axios';

type AxiosHeaders = {
  [key: string]: string;
};

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
