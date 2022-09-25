import {MeliApiError} from './general';

export type LooseAutocomplete<T extends string> = T | Omit<string, T>;

export type MeliResponse<T> = { data: T, error: null } | { data: null, error: MeliApiError };
