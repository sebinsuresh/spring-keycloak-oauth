const express = require('express');
const PORT = 5000;

const FILTERS_CONFIG = {
    urls: [],
    form_names: [],
    from_ports: new Set()
};
FILTERS_CONFIG.urls.push('/favicon.ico');

const NICKNAME_MAP = new Map();
NICKNAME_MAP.set('keycloak:8080', 'Keycloak-Auth-Service');
NICKNAME_MAP.set('host.docker.internal:8081', 'Spring-BFF');
NICKNAME_MAP.set('host.docker.internal:4200', 'Angular-App');

function shouldLog(payload, filters = FILTERS_CONFIG) {
    if (!payload) return true;
    const { url, form_name, from_port } = payload;

    if (Array.isArray(filters.urls) && filters.urls.length > 0 && typeof url === 'string') {
        for (const u of filters.urls) {
            if (!u) continue;
            if (url === u || url.includes(u)) return false;
        }
    }

    if (Array.isArray(filters.form_names) && filters.form_names.length > 0 && form_name) {
        if (filters.form_names.includes(form_name)) return false;
    }

    if (filters.from_ports instanceof Set && from_port != null) {
        const portVal = typeof from_port === 'string' ? parseInt(from_port, 10) : from_port;
        if (filters.from_ports.has(portVal)) return false;
    }

    return true;
}

function resolveNickname(name, port, nicknameMap = NICKNAME_MAP) {
    if (!name && (port == null)) return undefined;
    const key = `${name}:${port}`;
    return nicknameMap.get(key) || key;
}

function formatRecord(payload, nicknameMap = NICKNAME_MAP) {
    const {
        from_name,
        from_port,
        to_name,
        to_port,
        method,
        url,
        body,
        form_name
    } = payload || {};

    return {
        source: {
            name: from_name,
            port: from_port,
            nickname: resolveNickname(from_name, from_port, nicknameMap)
        },
        destination: {
            name: to_name,
            port: to_port,
            nickname: resolveNickname(to_name, to_port, nicknameMap)
        },
        method,
        url,
        body,
        form_name,
        raw: payload
    };
}

function logRecord(record, logger = console) {
    if (!record) return;
    logger.log('--- New Intercepted Request ---');
    logger.log(`Source:      ${record.source.nickname}`);
    logger.log(`Destination: ${record.destination.nickname}`);
    logger.log(`Action:      ${record.method} ${record.url}`);
    if (record.form_name) logger.log(`Form:        ${record.form_name}`);
    if (record.body) logger.log(`Payload:     ${record.body}`);
    else logger.log('Payload:     [Empty]');
}

function createApp({ filters = FILTERS_CONFIG, nicknameMap = NICKNAME_MAP, logger = console } = {}) {
    const app = express();
    app.use(express.json({ limit: '10mb' }));

    app.post('/', (req, res) => {
        const payload = req.body;
        if (!shouldLog(payload, filters)) return res.status(204).send();
        const record = formatRecord(payload, nicknameMap);
        logRecord(record, logger);
        return res.status(204).send();
    });

    return app;
}

const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Logging API listening on port ${PORT}`);
});
