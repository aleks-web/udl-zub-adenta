import { defineConfig } from "vite";
import includeHtml from "vite-plugin-include-html";
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [includeHtml()],
    resolve: {
        alias: {
            '@img': resolve(__dirname, './src/assets/images')
        }
    },
});