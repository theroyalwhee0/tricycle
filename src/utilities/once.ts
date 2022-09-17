const Unset = Symbol('Unset');
type UnsetType = typeof Unset;

// REF: https://stackoverflow.com/questions/58083588/typescript-generic-once-function

export function once<TArgs extends unknown[], TReturn, TThis>(fn: (this: TThis, ...arg: TArgs) => TReturn) {
    let value:TReturn|UnsetType = Unset;
    return function(this: TThis, ...args: TArgs):TReturn {
        if(value === Unset) {
            value = fn.apply(this, args) as TReturn;
        }
        return value;
    };    
}
