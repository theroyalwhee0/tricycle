export type RequiredKeys<TValue extends object, TKeys extends keyof TValue> = (
    Required<Pick<TValue, TKeys>> & Omit<TValue, TKeys>
);
