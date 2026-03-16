const records = [];
const renderer = new Renderer();

// SSE connection
const es = new EventSource('/events/listen');

es.addEventListener('message', (e) => {
    records.push(JSON.parse(e.data));
    renderer.scheduleRender(records);
});

es.addEventListener('clear', () => {
    records.length = 0;
    renderer.scheduleRender(records);
});

es.onopen = () => {
    const statusEl = document.getElementById('status');
    statusEl.textContent = 'Connected';
    statusEl.className = 'connected';
};

es.onerror = () => {
    const statusEl = document.getElementById('status');
    statusEl.textContent = 'Disconnected — retrying…';
    statusEl.className = 'disconnected';
};

document.getElementById('clear-btn').addEventListener('click', () => {
    fetch('/events/clear', { method: 'POST' });
});
