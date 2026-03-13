function format_json(r) {
    const log = {
        from_name: r.variables.remote_addr,
        from_port: r.variables.remote_port,
        to_name: r.variables.server_addr,
        to_port: r.variables.server_port,
        method: r.method,
        url: r.variables.request_uri,
        body: r.requestBuffer ? r.requestBuffer.toString() : ""
    };
    return JSON.stringify(log);
}

export default { format_json };
