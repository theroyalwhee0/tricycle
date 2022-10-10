import { Context } from ".";
import { IHttpContext } from "../http/context";
import { ITimerContext } from "../timer/context";

// Remove built-in context properties when they aren't used in specific contexts and 
// flags optional properties as present when they will always be available in that context.
// This does not affect custom properties unless they extend the built-in properties.

export type OnlyHttp<TContext extends Context> =
    Omit<TContext, keyof ITimerContext> &
    Required<IHttpContext>
    ;

export type OnlyTimer<TContext extends Context> =
    Omit<TContext, keyof IHttpContext> &
    Required<ITimerContext>
    ;
