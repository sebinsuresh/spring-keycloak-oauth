function format_json(r) {
    const target = r.variables.target_service || "unknown:0";
    const parts = target.split(':');

    // Explicit assignment instead of destructuring
    const targetName = parts[0];
    const targetPort = parts[1] || "80";

    // Copy request headers (if any)
    const headers = {};
    if (r.headersIn) {
        for (const name in r.headersIn) {
            headers[name] = r.headersIn[name];
        }
    }

    // Simplified WS detection: use nginx-provided $http_upgrade only
    const isWebSocket = r.variables.http_upgrade === 'websocket';
    const type = isWebSocket ? 'ws' : 'http';

    const log = {
        from_name: r.variables.remote_addr,
        from_port: r.variables.remote_port,
        to_name: targetName,
        to_port: targetPort,
        method: r.method,
        url: r.variables.request_uri,
        type: type,
        headers: headers,
        body: r.requestBuffer ? r.requestBuffer.toString() : "",
    };
    return JSON.stringify(log);
}

export default { format_json };
