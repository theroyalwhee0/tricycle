import { Context } from '../context';
import { OnlyHttp } from '../context/restrict';

export type HttpFunction<TContext extends Context> = Awaited<(ctx: OnlyHttp<TContext>) => void>;
