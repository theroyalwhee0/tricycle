import { Context as AzureContext } from '@azure/functions';
import { RemovableContextProperties } from '../context';
import { RequiredKeys } from '../utilities/types';
import { TimerContext } from './context';

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

export type TimerInfo = AzureTimerInfo;

export type TimerRequire = 'timer';
export type TimerExclude = Exclude<RemovableContextProperties, TimerRequire>;

 export type TimerFunction<TContext extends TimerContext> = Awaited<
    (ctx: (
        Omit<(
            RequiredKeys<(
                TContext
            ), TimerRequire>
        ), TimerExclude>
    )) => void
>;
