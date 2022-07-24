import tricycle from './app';
import { HeaderNames, MimeTypes, HttpStatus } from '@tricycle/tricycle';

interface HealthyBody {
    ok: true
}

const healthyQuery = tricycle.endpoint<HealthyBody>(async (ctx) => {
    ctx.body = {
        ok: true
    };
    ctx.response.headers[HeaderNames.ContentType] = MimeTypes.JSON;
    ctx.status = HttpStatus.OK;
});

export default healthyQuery;
