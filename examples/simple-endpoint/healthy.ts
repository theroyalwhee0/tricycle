import { HeaderNames, MimeTypes, HttpStatus } from '@tricycle/tricycle';
import tricycle from './app';

type HealthyBody = {
    ok: true
}
type HealthyStatus = HttpStatus.OK;
type HealthyHeaders = {
    'content-type': string
}

const healthyQuery = tricycle.endpoint<HealthyBody, HealthyStatus, HealthyHeaders>((ctx) => {
    ctx.body = {
        ok: true
    };
    ctx.response.headers[HeaderNames.ContentType] = MimeTypes.ApplicationJson;
    ctx.status = HttpStatus.OK;
});

export default healthyQuery;
