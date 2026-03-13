const express = require('express');
const path = require('path');
const PORT = 5000;

// Global, mutable filters list — edit this at runtime to add/remove filters
const FILTERS = {
    urls: ['/favicon.ico'],
    urlPatterns: [
        /^\/@fs\//,
        /^\/@ng\//,
        /^\/@vite\//,
        /\.well-known/,
        /styles\.css/,
        /main\.js/,
        /\.woff2$/,
        /\.css$/,
        /\.js$/,
        /\.svg$/
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

function detectSourceFromUserAgent(userAgent) {
    if (!userAgent) return null;
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';

    // For now need to assume this is BFF client and not some other app's Java client.
    if (userAgent.includes('Java-http-client/21.0.9')) return 'Spring-BFF Http client 1';
    if (userAgent.includes('Java/21.0.9')) return 'Spring-BFF Http client 2';

    return null;
}

function resolveNickname(name, port, userAgent) {
    if (!name && (port == null)) return undefined;

    const key = `${name}:${port}`;
    
    let resolvedNickname = NICKNAME_MAP.get(key);
    if (!resolvedNickname) {
        const detectedSource = detectSourceFromUserAgent(userAgent);
        resolvedNickname = detectedSource;
        if (!resolvedNickname) {
            resolvedNickname = key + (userAgent ? ` (${userAgent})` : '');
        }
    }
    return resolvedNickname;
}

function formatRecord(payload) {
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
        form_name,
        raw: payload,
        type,
    };
}

function logRecord(record, logger = console) {
    if (!record) return;

    // logger.log('--- New Intercepted Request ---');
    // logger.log(`Source:      ${record.source.nickname}`);
    // logger.log(`Destination: ${record.destination.nickname}`);
    // logger.log(`Action:      ${record.type} ${record.method} ${record.url}`);

    // if (record.form_name) {
    //     logger.log(`Form:        ${record.form_name}`);
    // }

    // if (record.body) {
    //     logger.log(`Payload:     ${record.body}`);
    // } else {
    //     logger.log('Payload:     [Empty]');
    // }

    logger.log(`${record.source.nickname} --(${record.method} ${record.url})--> ${record.destination.nickname}`);
}

function createApp({ logger = console } = {}) {
    const app = express();
    app.use(express.json({ limit: '10mb' }));

    // In-memory store of slim records and connected SSE clients
    const records = [];
    const clients = new Set();

    function broadcast(eventName, data) {
        const frame = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
        for (const client of clients) {
            client.write(frame);
        }
    }

    // Serve the frontend
    app.use(express.static(path.join(__dirname, 'public')));

    // Serve mermaid from node_modules
    app.get('/mermaid.min.js', (req, res) => {
        res.sendFile(path.join(__dirname, 'node_modules', 'mermaid', 'dist', 'mermaid.min.js'));
    });

    // SSE endpoint — replays history then streams live events
    app.get('/events', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        // Replay existing records
        for (const record of records) {
            res.write(`event: message\ndata: ${JSON.stringify(record)}\n\n`);
        }

        clients.add(res);
        req.on('close', () => clients.delete(res));
    });

    // Clear all records and notify all connected clients
    app.post('/clear', (req, res) => {
        records.length = 0;
        broadcast('clear', {});
        return res.status(204).send();
    });

    app.post('/', (req, res) => {
        const payload = req.body;

        if (!shouldLog(payload)) {
            return res.status(204).send();
        }

        const record = formatRecord(payload);
        logRecord(record, logger);

        const slim = {
            source: record.source.nickname,
            destination: record.destination.nickname,
            method: record.method,
            url: record.url,
        };
        records.push(slim);
        broadcast('message', slim);

        return res.status(204).send();
    });

    return app;
}

const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Logging API listening on port ${PORT}`);
});
