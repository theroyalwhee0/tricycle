import {
    Context as AzureContext,
    HttpRequest as AzureHttpRequest
} from '@azure/functions';

/**
 * Context Platform interface.
 */
export interface IPlatform {
    azureContext: AzureContext
    azureRequest: AzureHttpRequest
}

/**
 * Context Platform class.
 */
export class Platform implements IPlatform {
    /**
     * Reference to the current Azure Context.
     */
    azureContext: Readonly<AzureContext>

    /**
     * Reference to the current Azure Request.
     */
    azureRequest: Readonly<AzureHttpRequest>

    /**
     * Create an instance of the Context.Platform.
     * @param azureContext The current Azure Context.
     * @param azureRequest The current Azure Request.
     */
    constructor(azureContext: Readonly<AzureContext>, azureRequest: Readonly<AzureHttpRequest>) {
        this.azureContext = azureContext;
        this.azureRequest = azureRequest;
    }
}