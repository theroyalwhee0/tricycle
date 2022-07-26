import {
    Context as AzureContext,
    HttpRequest as AzureHttpRequest
} from '@azure/functions';

export interface IPlatform {
    azureContext: AzureContext
    azureRequest: AzureHttpRequest
}

export class Platform implements IPlatform {
    azureContext: AzureContext
    azureRequest: AzureHttpRequest
}