# Endpoints - TricycleJS

```ts
import app from './my-app';

export myHttpTrigger = app.endpoint(async (ctx) => {
    ctx.response.body = { 
        timestamp: Date.now()
    };
});

export default myHttpTrigger;
```

## Automatic properties
Tricycle varies some default properties based on what context properties were set.


| Body                      | Status | Content Type | Results                           |
| ------------------------- | ------ | ------------ | --------------------------------- |
| Unset                     | Unset  | Unset        | 404 with 'Not Found' body         |
| Unset                     | Unset  | Set          | 404 Not Found                     |
| null                      | Unset  | Unset        | 204 No Content                    |
| undefined                 | Unset  | Unset        | 204 No Content                    |
| is a String               | Any    | Unset        | Content-Type 'text/plain'         |
| is a Boolean              | Any    | Unset        | Content-Type 'application/json'   |
| is an Array               | Any    | Unset        | Content-Type 'application/json'   |
| is an Object              | Any    | Unset        | Content-Type 'application/json'   |

Additionally these rules are applied:
- If no Status is set then status is set to 200.
- If no Content-Type is set then content type is set to 'application/octet-stream'.
- If Status is 204 then Content-Type is removed.
