if (!mermaid) {
    throw new Error('Mermaid library is required but not loaded');
}

mermaid.initialize({ startOnLoad: false, theme: 'default' });

class Renderer {
    constructor() {
        this.renderTimer = null;
        this.renderId = 0;
        this.containerEl = document.getElementById('diagram-container');
        this.records = null;
    }

    _getParticipantsInOrder() {
        const participantOrder = [];
        const seen = new Set();

        for (const r of this.records) {
            if (!seen.has(r.source)) {
                seen.add(r.source);
                participantOrder.push(r.source);
            }
            if (!seen.has(r.destination)) {
                seen.add(r.destination);
                participantOrder.push(r.destination);
            }
        }

        return participantOrder;
    }

    _buildDiagram() {
        const validRecords = this.records.filter(r => r.source && r.destination);
        if (validRecords.length === 0) {
            return null;
        }

        const participantOrder = this._getParticipantsInOrder();

        const sequence = MermaidSequenceBuilder.create();
        for (const participant of participantOrder) {
            sequence.addParticipant(participant);
        }
        for (const r of validRecords) {
            if (r.source && r.destination) {
                sequence.addMessage(r.source, r.destination, r.method, r.url);
            }
        }
        return sequence.build();
    }

    async _renderDiagram() {
        const diagramCode = this._buildDiagram();
        if (!diagramCode) {
            this.containerEl.innerHTML = '<span id="placeholder">Waiting for requests…</span>';
            return;
        }

        try {
            // Use an incrementing ID so Mermaid never
            // collides with a prior render element
            const id = `mermaid-render-${++this.renderId}`;
            const { svg } = await mermaid.render(id, diagramCode);
            this.containerEl.innerHTML = svg;

            // Remove fixed height so SVG scales with its container
            const svgEl = this.containerEl.querySelector('svg');
            if (svgEl) {
                svgEl.removeAttribute('height');
            }
        } catch (err) {
            console.error('Mermaid render error:', err);
        }
    }

    scheduleRender(records) {
        clearTimeout(this.renderTimer);
        this.records = records;

        // 60 ms debounce — batches rapid history-replay events into one render
        this.renderTimer = setTimeout(() => this._renderDiagram(), 60);
    }
}

