import {LooseAutocomplete} from './utils';

export type GetQuestionsOptions =
    | {
    sellerId: number;
    sortFields?: AvailableQuestionsSorts[];
    sortType?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
    status?: MeliQuestionStatus;
}
    | {
    itemId: string;
    sortFields?: AvailableQuestionsSorts[];
    sortType?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
    status?: MeliQuestionStatus;
}
    | {
    itemId: string;
    askerId: number;
    sortFields?: AvailableQuestionsSorts[];
    sortType?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
    status?: MeliQuestionStatus;
}
    | { questionId: string };

export type AvailableQuestionsSorts = LooseAutocomplete<'item_id' | 'from_id' | 'date_created' | 'seller_id'>;

export type MeliQuestionStatus = LooseAutocomplete<| 'UNANSWERED'
    | 'ANSWERED'
    | 'CLOSED_UNANSWERED'
    | 'UNDER_REVIEW'
    | 'DISABLED'
    | 'BANNED'
    | 'DELETED'>

export type AskQuestionOptions = { text: string; itemId: string };
