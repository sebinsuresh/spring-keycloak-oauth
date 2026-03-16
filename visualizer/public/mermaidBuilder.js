// Query params with usually long values
const PARAMS_TO_TRUNCATE = new Set([
    'id_token_hint',
    'access_token',
    'state',
    'code',
    'client_data',
]);

class MermaidSequenceBuilder {
    constructor() {
        this.sequence = [];
        this.alias = new Map();
    }

    static create() {
        const builder = new MermaidSequenceBuilder();
        builder.sequence.push('sequenceDiagram');
        return builder;
    }

    addParticipant(name) {
        this.alias.set(name, `p${this.alias.size}`);
        this.sequence.push(
            `    participant ${this.alias.get(name)} as ${name}`
        );
        return this;
    }

    addMessage(source, destination, method, url) {
        const sourceAlias = this.alias.get(source);
        const destinationAlias = this.alias.get(destination);
        const shrunkUrl = URLFormatter.shrinkUrl(url, PARAMS_TO_TRUNCATE);

        this.sequence.push(
            `    ${sourceAlias}->>${destinationAlias}: ${method} ${shrunkUrl}`
        );
        return this;
    }

    build() {
        return this.sequence.join('\n');
    }
}
