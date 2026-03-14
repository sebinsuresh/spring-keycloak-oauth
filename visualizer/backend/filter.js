import { ANGULAR_CLI, resolveNickname } from "./nicknames.js";

// Global, mutable filters list — edit this at runtime to add/remove filters
const FILTERS = {
    urls: [
        '/favicon.ico',
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
    from_names: [],
    from_ports: [],
};

function matchesUrlPattern(url, pattern) {
    if (!url || !pattern) return false;

    if (pattern instanceof RegExp) {
        return pattern.test(url);
    }
    if (typeof pattern === 'string') {
        return url.includes(pattern);
    }
    return false;
}

export function shouldCapture(payload) {
    if (!payload) return true;

    const { url, from_name, from_port, type, to_name, to_port } = payload;

    if (type === 'ws' && resolveNickname(to_name, to_port) === ANGULAR_CLI) {
        return false;
    }

    for (const u of FILTERS.urls) {
        if (matchesUrlPattern(url, u)) {
            return false;
        }
    }

    if (FILTERS.from_names.includes(from_name)) {
        return false;
    }

    if (from_port != null) {
        const portVal = typeof from_port === 'string' ?
            parseInt(from_port, 10) :
            from_port;

        if (FILTERS.from_ports.includes(portVal)) {
            return false;
        }
    }

    return true;
}
