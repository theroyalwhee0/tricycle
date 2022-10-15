import { Context } from '..';

/**
 * Concerns are a type describing a Property from the Context to 
 * override (the Key) and child Properties to hide if they are 
 * unused (the Value).
 */
export type SpecializationConcerns<T extends object = object> = {
    [Key in keyof T]: string | number | symbol
};

/**
 * Specialize TContext, overriding with properties from TSpecialization
 * based on specified TConcerns.
 */
export type SpecializeContext<
    TContext extends Context,
    TSpecialization extends object,
    TConcerns extends SpecializationConcerns
> = (
    Omit<TContext, keyof TConcerns>
        & ({
        [Key in keyof TConcerns]: (
            Key extends keyof TContext & keyof TSpecialization ? (
                TSpecialization[Key]
            ) : Key extends keyof TContext ? (
                TContext[Key]
            ) : (
                never
            )
        )
    })
);

