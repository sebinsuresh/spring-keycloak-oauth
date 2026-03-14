
mermaid.initialize({ startOnLoad: false, theme: 'default' });

const records = [];
let renderTimer = null;
let renderId = 0;

const containerEl = document.getElementById('diagram-container');
const statusEl = document.getElementById('status');

// Query params that should have long values truncated in the middle
const PARAMS_TO_TRUNCATE = new Set([
    'id_token_hint',
    'access_token',
    'state',
    'code',
    'client_data',
]);

function truncateQueryParam(paramName, paramValue, maxLen = 50) {
    if (paramValue.length <= maxLen) return paramValue;
    const half = Math.floor((maxLen - 1) / 2);
    return paramValue.slice(0, half) + '…' + paramValue.slice(-half);
}

function truncateUrl(url) {
    // Only handle specific query params with middle-truncation
    // Keep the full path and other query params intact
    let result = url;
    for (const param of PARAMS_TO_TRUNCATE) {
        const regex = new RegExp(`([?&]${param}=)([^&]+)`, 'g');
        result = result.replace(regex, (match, prefix, value) => {
            return prefix + truncateQueryParam(param, value, 80);
        });
    }
    return result;
}

function wrapUrl(url, lineLen = 80) {
    // Apply query param truncation first, then wrap long lines
    const truncated = truncateUrl(url);
    if (truncated.length <= lineLen) return truncated;
    const lines = [];
    for (let i = 0; i < truncated.length; i += lineLen) {
        lines.push(truncated.slice(i, i + lineLen));
    }
    return lines.join('<br>');
}

function buildDiagram() {
    const valid = records.filter(r => r.source && r.destination);
    if (valid.length === 0) return null;

    // Collect unique participants in first-seen order
    const participantOrder = [];
    const seen = new Set();
    for (const r of valid) {
        if (!seen.has(r.source)) { seen.add(r.source); participantOrder.push(r.source); }
        if (!seen.has(r.destination)) { seen.add(r.destination); participantOrder.push(r.destination); }
    }

    // Safe short aliases avoid Mermaid mis-parsing names with hyphens in arrow syntax
    const alias = new Map();
    participantOrder.forEach((name, i) => alias.set(name, `p${i}`));

    const lines = ['sequenceDiagram'];
    for (const name of participantOrder) {
        lines.push(`    participant ${alias.get(name)} as ${name}`);
    }
    for (const r of valid) {
        lines.push(`    ${alias.get(r.source)}->>${alias.get(r.destination)}: ${r.method} ${wrapUrl(r.url)}`);
    }

    return lines.join('\n');
}

async function renderDiagram() {
    renderTimer = null;
    const def = buildDiagram();
    if (!def) {
        containerEl.innerHTML = '<span id="placeholder">Waiting for requests…</span>';
        return;
    }
    try {
        // Use an incrementing ID so Mermaid never collides with a prior render element
        const id = `mermaid-render-${++renderId}`;
        const { svg } = await mermaid.render(id, def);
        containerEl.innerHTML = svg;
        // Remove fixed height so SVG scales with its container
        const svgEl = containerEl.querySelector('svg');
        if (svgEl) svgEl.removeAttribute('height');
    } catch (err) {
        console.error('Mermaid render error:', err);
    }
}

function scheduleRender() {
    clearTimeout(renderTimer);
    // 60 ms debounce — batches rapid history-replay events into one render
    renderTimer = setTimeout(renderDiagram, 60);
}

// SSE connection
const es = new EventSource('/events/listen');

es.addEventListener('message', (e) => {
    records.push(JSON.parse(e.data));
    scheduleRender();
});

es.addEventListener('clear', () => {
    records.length = 0;
    scheduleRender();
});

es.onopen = () => { statusEl.textContent = 'Connected'; statusEl.className = 'connected'; };
es.onerror = () => { statusEl.textContent = 'Disconnected — retrying…'; statusEl.className = 'disconnected'; };

document.getElementById('clear-btn').addEventListener('click', () => {
    fetch('/events/clear', { method: 'POST' });
});
