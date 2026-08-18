import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
export default { plugins: [react(), viteSingleFile()] };
