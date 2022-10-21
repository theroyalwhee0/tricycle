import { Context as AzureContext } from '@azure/functions';
import { AzureTimerInfo, TimerInfo } from '.';
import { Tricycle } from '../app';
import { BaseContext, Context, ContextKind } from '../context';
import { RequiredKeys } from '../utilities/types';


export interface ITimerContext {
    readonly timer?: TimerInfo    
}

export class TimerContext<TContext extends Context=Context> extends BaseContext<TContext> implements ITimerContext {
    readonly kind: ContextKind;
    readonly timer?: TimerInfo;
    constructor(tricycle: Tricycle<TContext>, azureContext: Readonly<AzureContext>, timerInfo:AzureTimerInfo) {
        super(tricycle, azureContext);
        this.kind = ContextKind.Timer;
        this.timer = timerInfo;
    }
}

export type TimerContextRequired<TContext extends Context>  = TContext & RequiredKeys<TimerContext<TContext>, 'timer'>;
