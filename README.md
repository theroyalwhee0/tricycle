# @tricycle/tricycle : TricycleJS Azure Functions Framework

## Description
TricycleJS is a library to simplify working with Azure Functions in Typescript. It is modeled after [KoaJS](https://koajs.com/) when possible.

TricycleJS is currently in Alpha and it's API is unstable. Please don't use it for anything important.

Features
- Middlware: Strongly typed middleware
- API: API modeled after the KoaJS API
- Azure Functions: Access to underlying Azure Functions primatives


## Installation
`npm install @tricycle/tricycle`


## Usage

TricycleJS is used by creating an instance of Tricycle, extending it via middleware, and building endpoints from it.
It is important to note that in TricycleJS every mutation of the Tricycle object clones and returns a new instance. 


```js {}[app.js]
import Tricycle from '@tricycle/tricycle';
import greetings from './greetings.js';
export const app = new Tricycle()
    .middleware(greetings);
```

```js {}[greetings.js]
export default function greetings() {
    return function greetingsMiddleware(context) {
        context.response.headers['x-greetings'] = 'hi';
    }
}
```

```js {}[endpoint.js]
import app from './app.js';

export const myEndpoint = app.endpoint((context) => {
    context.response.body = {
        hello: 'world'
    };
});
```

## Links
- GitHub: https://github.com/theroyalwhee0/tricycle
- NPM: https://www.npmjs.com/package/@tricycle/tricycle


## History
- v0.0.8
    - Add type specialization for http status and response headers for endpoints.
    - Add Typescript example code.
    - Code cleanup.
- v0.0.7
    - Add type specialization for endpoint middleware.
    - Remove unneeded interfaces.
    - Fix example code.
- v0.0.5
    - Improve middleware ordering to match Koa.
    - Add initial example code.
    - Force clean build on dryrun.
- v0.0.4
    - Middlware exports.
    - Build improvements.
    - Add metadata to package.json.
- v0.0.3
    - Build and export changes.
- v0.0.2
    - Build changes.
- v0.0.1
    - Initial release.


## Legal & License
Copyright 2022 Adam Mill

This library is released under Apache 2 license. See [LICENSE](https://github.com/theroyalwhee0/tricycle/blob/master/LICENSE) for more details.
