export type JsonPrimative = null | string | boolean | number
export type JsonArray = JsonValue[]
export type JsonValue = JsonPrimative | JsonObject | JsonArray
export type JsonObject = {
    [key: string]: JsonValue
}
