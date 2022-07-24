
export interface IRequest {
    method: string
    url: string
};

export class Request implements IRequest {
    method: string
    url: string
}
