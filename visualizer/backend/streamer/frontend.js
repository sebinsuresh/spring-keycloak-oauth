import { Router, static as static_ } from "express";
import { join } from 'path';

export const frontendRoutes = Router();

// Serve the frontend html and assets
frontendRoutes.use(static_(join(
    import.meta.dirname,
    '..',
    '..',
    'public',
)));

// Serve mermaid.js from node_modules
frontendRoutes.get('/mermaid.min.js', (req, res) => {
    res.sendFile(join(
        import.meta.dirname,
        '..',
        '..',
        'node_modules',
        'mermaid',
        'dist',
        'mermaid.min.js',
    ));
});
