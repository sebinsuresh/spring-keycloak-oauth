import { resolveNickname } from './nicknames.js';

export function createRecord(payload) {
    const {
        from_name,
        from_port,
        to_name,
        to_port,
        method,
        url,
        body,
        type,
        headers,
    } = payload || {};

    const userAgent = headers ? headers['User-Agent'] : null;

    return {
        source: {
            name: from_name,
            port: from_port,
            nickname: resolveNickname(from_name, from_port, userAgent)
        },
        destination: {
            name: to_name,
            port: to_port,
            nickname: resolveNickname(to_name, to_port)
        },
        method,
        url,
        body,
        raw: payload,
        type,
    };
}
