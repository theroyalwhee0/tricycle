import { JsonValue } from "./utilities/json"

export interface IRequest {
    method: string
    url: string
    body?: JsonValue
    rawBody?: string
}

export class Request implements IRequest {
    method: string
    url: string
    body?: JsonValue
    rawBody?: string
}
