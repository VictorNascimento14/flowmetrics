
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root');

if (!container) {
  throw new Error("Não foi possível encontrar o elemento root.");
}

try {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("FlowMetrics Dashboard iniciado com sucesso.");
} catch (error) {
  console.error("Erro crítico na renderização:", error);
  container.innerHTML = `<div style="color: white; padding: 20px; font-family: sans-serif;">
    <h1>Erro ao carregar o dashboard</h1>
    <p>${error instanceof Error ? error.message : "Erro desconhecido"}</p>
  </div>`;
}
