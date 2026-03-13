const express = require('express');
const PORT = 5000;

// Global, mutable filters list — edit this at runtime to add/remove filters
const FILTERS = {
    urls: ['/favicon.ico'],
    urlPatterns: [
        /^\/@fs\//,
        /^\/@ng\//,
        /^\/@vite\//,
    ],
    form_names: [],
    from_ports: new Set()
};

const NICKNAME_MAP = new Map();
NICKNAME_MAP.set('keycloak:8080', 'Keycloak-Auth-Service');
NICKNAME_MAP.set('host.docker.internal:8081', 'Spring-BFF');
NICKNAME_MAP.set('host.docker.internal:4200', 'Angular-App');

function matchesUrlPattern(url, pattern) {
    if (!url) return false;
    if (pattern instanceof RegExp) return pattern.test(url);
    if (typeof pattern === 'string') {
        try {
            const re = new RegExp(pattern);
            return re.test(url);
        } catch (e) {
            return url.includes(pattern);
        }
    }
    return false;
}

function shouldLog(payload) {
    if (!payload) return true;
    const { url, form_name, from_port, type, to_name, to_port } = payload;

    if (type === 'ws' && resolveNickname(to_name, to_port) === 'Angular-App') return false;

    if (Array.isArray(FILTERS.urls) && FILTERS.urls.length > 0 && typeof url === 'string') {
        for (const u of FILTERS.urls) {
            if (!u) continue;
            if (url === u || url.includes(u)) return false;
        }
    }

    if (Array.isArray(FILTERS.urlPatterns) && FILTERS.urlPatterns.length > 0 && typeof url === 'string') {
        for (const p of FILTERS.urlPatterns) {
            if (!p) continue;
            if (matchesUrlPattern(url, p)) return false;
        }
    }

    if (Array.isArray(FILTERS.form_names) && FILTERS.form_names.length > 0 && form_name) {
        if (FILTERS.form_names.includes(form_name)) return false;
    }

    if (FILTERS.from_ports instanceof Set && from_port != null) {
        const portVal = typeof from_port === 'string' ? parseInt(from_port, 10) : from_port;
        if (FILTERS.from_ports.has(portVal)) return false;
    }

    return true;
}

function detectBrowser(userAgent) {
    if (!userAgent) return null;
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Browser';
}

function resolveNickname(name, port, userAgent) {
    if (!name && (port == null)) return undefined;

    const key = `${name}:${port}`;
    let resolvedNickname = NICKNAME_MAP.get(key);

    if (!resolvedNickname) {
        const browser = detectBrowser(userAgent);
        return `BROWSER (${browser})`;
    }
    return resolvedNickname || key;
}

function formatRecord(payload, userAgent) {
    const {
        from_name,
        from_port,
        to_name,
        to_port,
        method,
        url,
        body,
        form_name,
        type,
    } = payload || {};

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
        form_name,
        raw: payload,
        type,
    };
}

function logRecord(record, logger = console) {
    if (!record) return;

    logger.log('--- New Intercepted Request ---');
    logger.log(`Source:      ${record.source.nickname}`);
    logger.log(`Destination: ${record.destination.nickname}`);
    logger.log(`Action:      ${record.type} ${record.method} ${record.url}`);

    if (record.form_name) {
        logger.log(`Form:        ${record.form_name}`);
    }

    if (record.body) {
        logger.log(`Payload:     ${record.body}`);
    } else {
        logger.log('Payload:     [Empty]');
    }
}

function createApp({ logger = console } = {}) {
    const app = express();
    app.use(express.json({ limit: '10mb' }));

    app.post('/', (req, res) => {
        const payload = req.body;

        if (!shouldLog(payload)) {
            return res.status(204).send();
        }

        const record = formatRecord(payload, userAgent);
        logRecord(record, logger);
        return res.status(204).send();
    });

    return app;
}

const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Logging API listening on port ${PORT}`);
});
