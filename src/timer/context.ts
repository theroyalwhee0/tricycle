import { Context as AzureContext } from "@azure/functions";
import { AzureTimerInfo, TimerInfo } from ".";
import { BaseContext, ContextKind, Context } from "../context";
import { Tricycle } from "../tricycle";

export class TimerContext<TContext extends Context=Context> extends BaseContext<TContext>  {
    readonly kind: ContextKind;
    readonly timer?: TimerInfo
    constructor(tricycle: Tricycle<TContext>, azureContext: Readonly<AzureContext>, timerInfo:AzureTimerInfo) {
        super(tricycle, azureContext);
        this.kind = ContextKind.Timer;
        this.timer = timerInfo;
    }
}