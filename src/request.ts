export type RequestParams = Record<string, string>

export interface IRequest {
    method: string
    url: string
    params: RequestParams
}

export class Request implements IRequest {
    method: string
    url: string
    params: RequestParams = {}
}
