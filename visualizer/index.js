const express = require('express');
const app = express();
const PORT = 5000;

// Increase limit if you expect large request bodies from NGINX
app.use(express.json({ limit: '10mb' }));

app.post('/', (req, res) => {
    const {
        from_name,
        from_port,
        to_name,
        to_port,
        method,
        url,
        body
    } = req.body;

    console.log('--- New Intercepted Request ---');
    console.log(`Source:      ${from_name}:${from_port}`);
    console.log(`Destination: ${to_name}:${to_port}`);
    console.log(`Action:      ${method} ${url}`);

    if (body) {
        console.log(`Payload:     ${body}`);
    } else {
        console.log('Payload:     [Empty]');
    }

    // NGINX mirror ignores the response, but we return 204 No Content for hygiene
    res.status(204).send();
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Logging API listening on port ${PORT}`);
});
