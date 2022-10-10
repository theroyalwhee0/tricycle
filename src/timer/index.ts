import { Context as AzureContext } from "@azure/functions";
import { Context } from "../context";

export type AzureTimerInfo = {
    schedule: {
        adjustForDST: boolean
    },
    scheduleStatus: {
        last: string,
        next: string,
        lastUpdated: string,
    },
    isPastDue: boolean,
};

export type AzureTimerFunction = Awaited<(context: AzureContext, timerInfo: AzureTimerInfo) => void>;

export type TimerFunction<TContext extends Context> = Awaited<(context: TContext) => void>;

export type TimerInfo = AzureTimerInfo;
