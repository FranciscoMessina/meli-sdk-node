// @ts-ignore
import type { Options, Got } from 'got';

import { URLSearchParams } from 'url';
import { MeliResponse } from './types/utils';
import {
  MeliApiError,
  MeliCategoriesResponse,
  MeliCategoryAttributesResponse,
  MeliCategoryDetails,
  MeliGetItemsByIdsResponse,
  MeliItem,
  MeliItemAttributes,
  MeliMessagesResponse,
  MeliOrder,
  MeliOrdersSearchResponse,
  MeliQuestionsResponse,
  MeliQuestionsResponseTime,
  MeliSendMessageOptions,
  MeliUserData,
} from './types';
import { AskQuestionOptions, GetQuestionsOptions } from './types/questions';
import { PublicItemSearchOptions } from './types/items';

type HttpInstanceOptions = Omit<
  Options,
  'throwHttpErrors' | 'responseType' | 'prefixUrl'
>;

export interface SetAccountOptions {
  /** User access token for private resources */
  accessToken: string;
  /** User MELI Account ID  */
  accountId: number;
}

export class Meli {
  private accessToken?: string;
  public accountId?: number;

  protected http!: Got;
  protected gotOptions?: HttpInstanceOptions;

  constructor(props?: any) {
    if (typeof props === 'undefined' || props !=='a')
      throw new Error(
        "Cannot be called directly, please use static method 'create' "
      );
  }

  #parseReturn<T>(result: T | MeliApiError): MeliResponse<T> {
    if('error' in result) {
      return { error: result, response: null}
    }

    return { response:result, error: null}
  }

  static async create(httpInstanceOptions?: HttpInstanceOptions) {
    const instance = new Meli('a');
    const { got } = await import('got');

    const { hooks = { beforeRequest: [] }, ...rest } =
      httpInstanceOptions || {};
    const { beforeRequest, ...remainingHooks } = hooks;
    instance.http = got.extend({
      prefixUrl: 'https://api.mercadolibre.com',
      responseType: 'json',
      throwHttpErrors: false,
      retry: {
        limit: 0,
      },
      hooks: {
        beforeRequest: [
          (options) => {
            if (options.context.auth !== false) {
              console.log('Added token');
              options.headers[
                'Authorization'
              ] = `Bearer ${instance.accessToken}`;
            }
          },
          ...beforeRequest,
        ],
        ...remainingHooks,
      },
      ...rest,
    });

    return instance;
  }

  /** Set or update the user information to make requests to the Meli Api*/
  setAccount({ accessToken, accountId }: SetAccountOptions) {
    this.accessToken = accessToken;
    this.accountId = accountId;

    return this;
  }

  /** Reset all the user information in the class instance */
  resetAccount() {
    this.accessToken = undefined;
    this.accountId = undefined;
  }

  /** Make a GET request to the specified resource, only pass what comes after https://api.mercadolibre.com */
  async getResource<T = unknown>(resource: string): Promise<MeliResponse<T>> {
    const { body } = await this.http.get<T | MeliApiError>(
      `${resource.startsWith('/') ? resource.slice(0) : resource}`
    );


      return this.#parseReturn(body)



  }
  /** Obtiene preguntas de Mercado Libre, revisar la [documentación de MELI]{@link https://developers.mercadolibre.com.ar/es_ar/gestiona-preguntas-respuestas} para aprender mas.*/
  async getQuestions<T = MeliQuestionsResponse>(
    options: GetQuestionsOptions
  ): Promise<MeliResponse<T>> {
    const searchParams = new URLSearchParams();
    searchParams.append('api_version', '4');

    if ('questionId' in options) {
      const { body } = await this.http.get<T>(
        `questions/${options.questionId}`,
        {
          searchParams,
        }
      );

      return this.#parseReturn(body)
    }

    if ('sortFields' in options) {
      searchParams.append('sort_fields', options.sortFields!.join(',') || '');
    }
    if ('sortType' in options) {
      searchParams.append('sort_type', options.sortType || 'DESC');
    }

    if ('sellerId' in options) {
      searchParams.append('seller_id', options.sellerId.toString());
    }

    if ('itemId' in options) {
      searchParams.append('item', options.itemId);
    }

    if ('askerId' in options) {
      searchParams.append('from', options.askerId.toString());
    }

    searchParams.append('limit', options?.limit?.toString() || '50');
    searchParams.append('offset', options?.offset?.toString() || '0');

    if ('status' in options) {
      searchParams.append('status', options.status || '');
    }

    const { body } = await this.http.get<T>('questions/search', {
      searchParams,
    });

    return this.#parseReturn(body);
  }

  /** Ask a question with the current Account (Access token used) */
  async askQuestion<T>(options: AskQuestionOptions): Promise<MeliResponse<T>> {
    const { body } = await this.http.post<T>('questions', {
      json: {
        text: options.text,
        item_id: options.itemId,
      },
    });

    return this.#parseReturn(body);
  }

  /** Answer a question, you need to use the recipients AccessToken in order to be able to do it. */
  async answerQuestion<T>(
    questionId: number,
    answer: string
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.post<T>(`answers`, {
      json: {
        question_id: questionId,
        text: answer,
      },
    });

    return this.#parseReturn(body);
  }

  /** Delete a specific question by ID*/
  async deleteQuestion<T = [string]>(
    questionId: number
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.delete<T>(`questions/${questionId}`);

    return this.#parseReturn(body);
  }

  /** Block a user from asking questions on the current account*/
  async blockUser<T>(userToBlockId: number): Promise<MeliResponse<T>> {
    const { body } = await this.http.post<T>(
      `/users/${this.accountId}/questions_blacklist`,
      {
        json: {
          user_id: userToBlockId,
        },
      }
    );

    return this.#parseReturn(body);
  }

  /** Get all the blocked users. */
  async getBlockedUsers<T>(): Promise<MeliResponse<T>> {
    const { body } = await this.http.get<T>(
      `users/${this.accountId}/questions_blacklist`
    );

    return this.#parseReturn(body);
  }

  /** Unblock a user*/
  async unblockUser<T>(userToUnblockId: number): Promise<MeliResponse<T>> {
    const { body } = await this.http.delete<T>(
      `users/${this.accountId}/questions_blacklist/${userToUnblockId}`
    );

    return this.#parseReturn(body);
  }

  /** Search public items in a specific site depending on country (MLA, MLB, etc..)*/
  async publicItemSearch<T>(
    options: PublicItemSearchOptions
  ): Promise<MeliResponse<T>> {
    const searchParams = new URLSearchParams();

    const { body } = await this.http.get<T>(`sites/${options.siteId}/search`, {
      searchParams,
      context: {
        auth: false,
      },
    });

    return this.#parseReturn(body);
  }

  async getItemIds<T>(
    query?: string,
    options?: Record<string, any>
  ): Promise<MeliResponse<T>> {
    const searchParams = new URLSearchParams();

    if (query) {
      searchParams.append('q', query);
    }

    const { body } = await this.http.get<T>(
      `users/${this.accountId}/items/search`,
      {
        searchParams,
      }
    );

    return this.#parseReturn(body);
  }

  async createItem<T>(itemData: any): Promise<MeliResponse<T>> {
    const { body } = await this.http.post<T>(`items/`, {
      json: {
        ...itemData,
      },
    });

    return this.#parseReturn(body);
  }

  async addDescription<T>(
    itemId: string,
    description: string
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.post<T>(`items/${itemId}/description`, {
      json: {
        plain_text: description,
      },
    });

    return this.#parseReturn(body);
  }

  async changeItemStock<T>(
    itemId: string,
    newStock: number
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.put<T>(`items/${itemId}`, {
      json: {
        available_quantity: newStock,
      },
    });

    return this.#parseReturn(body);
  }

  async changeItemStatus<T>(
    itemId: string,
    status: 'active' | 'paused' | string
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.put<T>(`items/${itemId}`, {
      json: {
        status: status,
      },
    });

    return this.#parseReturn(body);
  }

  async getItems<K extends MeliItemAttributes>(
    ids: string[],
    selectAttributes?: K[]
  ): Promise<MeliResponse<MeliGetItemsByIdsResponse<K>[]>> {
    const params = new URLSearchParams();

    params.append('ids', ids.join(','));

    if (selectAttributes) {
      params.append('attributes', selectAttributes.join(','));
    }

    const { body } = await this.http.get<MeliGetItemsByIdsResponse[]>(`items`, {
      searchParams: params,
    });

    return this.#parseReturn(body);
  }

  async getItem<T extends MeliItemAttributes>(
    itemId: string,
    selectAttributes?: T[]
  ): Promise<MeliResponse<MeliItem>> {
    const params = new URLSearchParams();

    if (selectAttributes) {
      params.append('attributes', selectAttributes.join(','));
    }

    const { body } = await this.http.get<MeliItem>(`items/${itemId}`, {
      searchParams: params,
    });

    return this.#parseReturn(body);
  }

  async getUserInfo<T = MeliUserData>(
    userId: number
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.get<T>(`users/${userId}`);

    return this.#parseReturn(body);
  }

  async getOrders<T = MeliOrdersSearchResponse>(
    filters?: any
  ): Promise<MeliResponse<T>> {
    let url;

    switch (filters) {
      case 'recent':
        url = `orders/search/recent?seller=${this.accountId}&sort=date_desc`;
        break;
      case 'pending':
        url = `orders/search/pending?seller=${this.accountId}&sort=date_desc`;
        break;
      case 'archived':
        url = `orders/search/archived?seller=${this.accountId}&sort=date_desc`;
        break;
      default:
        url = `orders/search?seller=${this.accountId}&sort=date_desc`;
        break;
    }

    const { body } = await this.http.get<T>(url);

    return this.#parseReturn(body);
  }

  async getOrderDetails<T = MeliOrder>(
    orderId: number
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.get<T>(`orders/${orderId}`);

    return this.#parseReturn(body);
  }

  async getPackOrders<T>(packId: number): Promise<MeliResponse<T>> {
    const { body } = await this.http.get<T>(`packs/${packId}`);

    return this.#parseReturn(body);
  }

  async getOrderMessages<T = MeliMessagesResponse>(
    orderId: number
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.get<T>(
      `messages/packs/${orderId}/sellers/${this.accountId}?mark_as_read=false&tag=post_sale`
    );

    return this.#parseReturn(body);
  }

  async sendMessage<T>(
    options: MeliSendMessageOptions
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.post<T>(
      `messages/packs/${options.msgGroupId}/sellers/${this.accountId}?tag=post_sale`,
      {
        json: {
          from: {
            user_id: this.accountId,
          },
          to: {
            user_id: options.buyerId,
          },
          text: options.message,
        },
      }
    );
    return this.#parseReturn(body);

  }

  async getCategories<T = MeliCategoriesResponse>(
    siteId: string
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.get<T>(`sites/${siteId}/categories`);

    return this.#parseReturn(body);
  }

  async getCategoryDetails<T = MeliCategoryDetails>(
    categoryId: string
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.get<T>(`categories/${categoryId}`);

    return this.#parseReturn(body);
  }

  async getCategoryAttributes<T = MeliCategoryAttributesResponse>(
    categoryId: string
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.get<T>(
      `categories/${categoryId}/attributes`
    );

    return this.#parseReturn(body);
  }

  async getQuestionsResponseTime<T = MeliQuestionsResponseTime>(): Promise<
    MeliResponse<T>
  > {
    const { body } = await this.http.get<T>(
      `${this.accountId}/questions/response_time`
    );

    return this.#parseReturn(body);
  }

  async validateItem<T>(item: any): Promise<MeliResponse<T>> {
    const { body } = await this.http.post<T>(`items/validate`, {
      json: { ...item },
    });

    return this.#parseReturn(body);
  }

  async getComissionAmount<T>(
    categoryId: string,
    price: number
  ): Promise<MeliResponse<T>> {
    const { body } = await this.http.get<T>(
      `sites/MLA/listing_prices?price=${price}&category_id=${categoryId}`
    );

    return this.#parseReturn(body);
  }

  async getBillingInfo<T>(orderId: number): Promise<MeliResponse<T>> {
    const { body } = await this.http.get<T>(`orders/${orderId}/billing_info`);

    return this.#parseReturn(body);
  }
}
