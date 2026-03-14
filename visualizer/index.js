import { createApp } from "./backend/app.js";

const PORT = 5000;
const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Visualizer listening on port ${PORT}`);
});
