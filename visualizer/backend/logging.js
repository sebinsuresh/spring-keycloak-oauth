export function logRecord(record) {
    if (!record) return;
    console.log(`${record.source.nickname} --(${record.method} ${record.url})--> ${record.destination.nickname}`);
}