import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {existsSync} from 'node:fs';
import {resolve,sep} from 'node:path';

// Match Vercel's generated-page routing when previewing the production build.
const previewPages={name:'preview-generated-pages',configurePreviewServer(server){
 const root=resolve(server.config.root,server.config.build.outDir);
 server.middlewares.use((req,res,next)=>{
  const url=new URL(req.url,'http://localhost');
  const path=url.pathname.replace(/\/+$/,'');
  const file=resolve(root,'.'+path,'index.html');
  if(path&&!path.startsWith('/api/')&&!path.startsWith('/hq/api/')&&file.startsWith(root+sep)&&existsSync(file))req.url=path+'/index.html'+url.search;
  next();
 });
}};

export default defineConfig({
  envPrefix: "VITE",
  build: {
    outDir: "dist/client",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom/client"],
          icons: ["@phosphor-icons/react"],
        }
      }
    },
    sourcemap: false
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    proxy: {
      "/hq/api": "http://localhost:8787",
      "/api": "http://localhost:8787",
    },
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react(),previewPages],
});
