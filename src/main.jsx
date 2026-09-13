import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import { initAnalytics } from "./analytics.js";

initAnalytics();

const root=document.getElementById('root');
const initialProperty=JSON.parse(document.getElementById('hs-property-data')?.textContent||'null');
const initialProperties=JSON.parse(document.getElementById('hs-inventory-data')?.textContent||'null');
const app=(
  <React.StrictMode>
    <App initialProperty={initialProperty} initialProperties={initialProperties}/>
  </React.StrictMode>
);
if(initialProperty||initialProperties)hydrateRoot(root,app);
else createRoot(root).render(app);
