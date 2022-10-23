# TricycleJS Azure Functions Framework

## Description
TricycleJS is a library to simplify working with Azure Functions in Typescript.

TricycleJS is currently in Alpha and it's API is unstable. Please don't use it for anything important.

Features
- Middlware: Strongly typed middleware
- Endpoint: Type Specialization for Request & Response Body, Params, Headers, and Status
- Timers: Timers can share middleware with Endpoints
- API: The API modeled after the [KoaJS](https://koajs.com/) API
- Azure Functions: Access to underlying Azure Functions primatives


## Installation
`npm install @tricycle/tricycle`


## Usage

TricycleJS is used by creating an instance of Tricycle, extending it via middleware, and building endpoints and timers from it.


## First Party Middleware
- [Log Winston](https://github.com/theroyalwhee0/tricycle-log-winston) - Adds a Winston Logger to the context using the Azure Function Logger as a transport


## Links
- GitHub: https://github.com/theroyalwhee0/tricycle
- NPM: https://www.npmjs.com/package/@tricycle/tricycle


## History
- v0.1.0 - 2022-10-23
    - Major refactor of entire library.
    - Improved typing on endpoints.
    - Add timer support.
    - Improved tests.
- v0.0.14 - 2022-09-17
    - Turn on 'strictNullChecks' and adjust code to match.
    - Add support for 'undefined' body.
    - Improve body tests.
- v0.0.13 - 2022-09-17
    - Add additional common header names.
    - Improve invoke middleware. 'next' is no longer optional in middleware.
- v0.0.12 - 2022-09-04
    - Default status and content-type for various body types.
    - Improve tests.
- v0.0.11
    - Add request ip.
    - Change Request values to be wrappers of underlying Azure Request.
    - Add various Request URL replated properties.
    - Simplify code and improve comments and tests.
- v0.0.10
    - Add request.is() to check mime type.
    - Add request.is* type guards for request body.
    - Change MimeType names.
- v0.0.9
    - Add ctx.request.body for request body.
    - Add ctx.request.rawBody for request body string.
    - Add ctx.request.params for path parameters.
    - Add ctx.app to allow Tricycle instance to be accessed from middleware.
    - Change app.middleware() to app.use().
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
