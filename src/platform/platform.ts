import { Context as AzureContext } from '@azure/functions';

/**
 * Context Platform interface.
 */
 export interface IPlatform {
    azureContext: AzureContext
}
