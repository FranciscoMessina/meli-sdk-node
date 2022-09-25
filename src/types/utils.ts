import { MeliApiError } from './general';

export type LooseAutocomplete<T extends string> = T | Omit<string, T>;

export type MeliResponse<T> = { response: T, error: null} | { response: null, error:MeliApiError };
