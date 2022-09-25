// @ts-ignore
import type { Got } from 'got';
import { ConditionalReturn, MeliApiError, MeliOauthResponse } from './types';
import {MeliResponse} from "./types/utils";

enum GrantTypes {
  RefreshToken = 'refresh_token',
  Authorization = 'authorization_code',
}

type MeliOauthOrErrorResponse = MeliOauthResponse | MeliApiError;


interface GetAuthUrlOptions {
  /** Código que MELI te permite enviar para poder verificar el origen de la request.
   * [Mas información]{@link https://developers.mercadolibre.com.ar/es_ar/autenticacion-y-autorizacion#Realizando-la-autorizaci%C3%B3n}. */
  state?: string;

  /** La URL de autorización de MELI depende del pais en el que quieras trabajar, para Argentina: "https://auth.mercadolibre.com.ar/"*/
  auth_url: string;

  /** URL a donde MELI va a redireccionar luego de pedir la autorización del usuario para tu aplicación.*/
  redirect_uri: string;

  /** El ID de tu aplicación de MELI.*/
  client_id: string | number;
}

interface MeliAppConfig {
  /** URL a donde MELI va a redireccionar luego de pedir la autorización del usuario para tu aplicación.*/
  redirect_uri: string;

  /** El ID de tu aplicación de MELI.*/
  client_id: string | number;

  /** La clave secreta de tu aplicación de MELI. */
  client_secret: string;
}

/** Funciones para ayudar a autenticarse con la API de Mercado Libre
 * @link https://developers.mercadolibre.com.ar/autenticacion-y-autorizacion
 */
export class MeliOauth {
  /**Devuelve la url a donde hay que dirigir a las personas para que autoricen a tu aplicación en su cuenta de MELI.*/
  static getAuthUrl(options: GetAuthUrlOptions): string {
    return `${options.auth_url}/authorization?response_type=code&client_id=${options.client_id}&redirect_uri=${options.redirect_uri}${
        options.state ? `&state=${options.state}` : ''
    }`;
  }

  /**
   * @param code Código de autorización recibido de MELI.
   * @param appInfo Información de tu Aplicación de MELI.
   */
  static async authorize(
    code: string,
    appInfo: MeliAppConfig
  ): Promise<MeliResponse<MeliOauthResponse>> {
    const { got } = await import('got');

    const { body: response } = await got.post<MeliOauthOrErrorResponse>({
      json: {
        grant_type: GrantTypes.Authorization,
        client_id: appInfo.client_id,
        client_secret: appInfo.client_secret,
        code,
        redirect_uri: appInfo.redirect_uri,
      },
      retry: {
        limit: 0,
      },
      prefixUrl: 'https://api.mercadolibre.com/oauth/token',
      throwHttpErrors: false,
      responseType: 'json',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
    });

    if ('error' in response && response.error === 'invalid_request') {
      console.log(
        '[MELI SDK] Problema pidiendo ACCESS TOKEN con parametros en el BODY, enviando en los SEARCH PARAMS'
      );
      const searchParams = new URLSearchParams();
      searchParams.append('grant_type', GrantTypes.Authorization);
      searchParams.append('client_id', appInfo.client_id.toString());
      searchParams.append('client_secret', appInfo.client_secret);
      searchParams.append('redirect_uri', appInfo.redirect_uri);
      searchParams.append('code', code);

      const { body } = await got.post<MeliOauthOrErrorResponse>({
        searchParams,
        throwHttpErrors: false,
        prefixUrl: 'https://api.mercadolibre.com/oauth/token',
        responseType: 'json',
        retry: {
          limit: 0,
        },
        headers: {
          accept: 'application/json',
          'content-type': 'application/x-www-form-urlencoded',
        },
      });

      if ('error' in body) {
        return { response: null, error: body };
      }

      return { response: body, error: null };
    }

    return { response: response as MeliOauthResponse, error: null };
  }

  /**
   * @param refresh_token Refresh Token de MELI.
   * @param appInfo Información de tu Aplicación de MELI. */
  static async refreshAccessToken(
    refresh_token: string,
    appInfo: Omit<MeliAppConfig, 'redirect_uri'>
  ): Promise<MeliResponse<MeliOauthResponse>> {
    const { got } = await import('got');

    const { body: response } = await got.post<MeliOauthOrErrorResponse>({
      json: {
        grant_type: GrantTypes.RefreshToken,
        client_id: appInfo.client_id,
        client_secret: appInfo.client_secret,
        refresh_token,
      },
      retry: {
        limit: 0,
      },
      prefixUrl: 'https://api.mercadolibre.com/oauth/token',
      throwHttpErrors: false,
      responseType: 'json',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
    });

    if ('error' in response && response.error === 'invalid_request') {
        console.log(
            '[MELI SDK] Problema pidiendo ACCESS TOKEN con parametros en el BODY, enviando en los SEARCH PARAMS'
        );
      const searchParams = new URLSearchParams();
      searchParams.append('grant_type', GrantTypes.RefreshToken);
      searchParams.append('client_id', appInfo.client_id.toString());
      searchParams.append('client_secret', appInfo.client_secret);
      searchParams.append('refresh_token', refresh_token);

      const { body } = await got.post<MeliOauthOrErrorResponse>({
        searchParams,
        prefixUrl: 'https://api.mercadolibre.com/oauth/token',
        throwHttpErrors: false,
        responseType: 'json',
        retry: {
          limit: 0,
        },
        headers: {
          accept: 'application/json',
          'content-type': 'application/x-www-form-urlencoded',
        },
      });

      if ('error' in body) {
        return { response: null, error: body };
      }

      return { response: body, error: null };
    }

    return { response: response as MeliOauthResponse, error: null };
  }
}
