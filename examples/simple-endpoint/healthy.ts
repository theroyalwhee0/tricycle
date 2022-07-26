import tricycle from './app';
import { HeaderNames, MimeTypes, HttpStatus } from '@tricycle/tricycle';

type HealthyBody = {
    ok: true
}
type HealthyStatus = HttpStatus.OK;
type HealthyHeaders = {
    'content-type': string
}

const healthyQuery = tricycle.endpoint<HealthyBody, HealthyStatus, HealthyHeaders>(async (ctx) => {
    ctx.body = {
        ok: true
    };
    ctx.response.headers[HeaderNames.ContentType] = MimeTypes.JSON;
    ctx.status = HttpStatus.OK;
});

export default healthyQuery;
