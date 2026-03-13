function format_json(r) {
    const target = r.variables.target_service || "unknown:0";
    const parts = target.split(':');
    
    // Explicit assignment instead of destructuring
    const targetName = parts[0];
    const targetPort = parts[1] || "80";

    const log = {
        from_name: r.variables.remote_addr,
        from_port: r.variables.remote_port,
        to_name: targetName,
        to_port: targetPort,
        method: r.method,
        url: r.variables.request_uri,
        body: r.requestBuffer ? r.requestBuffer.toString() : "",
    };
    return JSON.stringify(log);
}

export default { format_json };
