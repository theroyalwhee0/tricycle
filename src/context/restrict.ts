import { Context } from '..';

/**
 * Concerns are a type describing a Property from the Context to 
 * override (the Key) and child Properties to hide if they are 
 * unused (the Value).
 */
export type RestrictConcerns = {
    [key: string]: string|number|symbol,
}

/**
 * Restrict TContext, overriding with properties from 
 * TSpecialization based on specified TConcerns.
 */
export type RestrictContext<
    TContext extends Context,
    TRestrict extends object,
    TConcerns extends RestrictConcerns
> = (
    Omit<TContext, keyof TConcerns> & ({
        [Key in keyof TConcerns]: (
            Key extends keyof TContext & keyof TRestrict ? (
                Omit<Exclude<TContext[Key], undefined>, (
                    keyof TRestrict[Key] | TConcerns[Key]
                )> & (
                    TRestrict[Key]
                )
            ) : Key extends keyof TContext ? (
                TContext[Key]
            ) : (
                never
            )
        )
    })
);

