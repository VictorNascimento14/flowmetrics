import React, { useEffect, useState } from 'react';
import { Terminal, Activity, Server } from 'lucide-react';

interface PythonResponse {
    status: string;
    language: string;
    message: string;
    timestamp: string;
}

export function PythonStatus() {
    const [data, setData] = useState<PythonResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // In local development with Vite only, /api may not work without proxy config.
        // However, for the purpose of valid code, we try to fetch.
        // We add a graceful fallback for local development.
        fetch('/api/hello')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                setData(data);
                setError(false);
            })
            .catch((err) => {
                console.warn("Python backend not reachable (expected if running locally without Vercel Dev)", err);
                setError(true);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center gap-2 p-3 bg-gray-900/50 rounded-lg border border-gray-800 animate-pulse">
            <Server className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Connecting to Python Kernel...</span>
        </div>
    );

    if (error) return (
        <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800/50">
            <div className="p-1.5 bg-yellow-500/10 rounded-md">
                <Terminal className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-300">Python Backend</span>
                <span className="text-[10px] text-gray-500">Offline (Deploy to Vercel to activate)</span>
            </div>
        </div>
    );

    return (
        <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]">
            <div className="p-1.5 bg-emerald-500/10 rounded-md relative">
                <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full" />
                <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-200">Python Service</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">
                        v3.12
                    </span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                    {data?.message || 'Operational'} • {new Date(data?.timestamp || '').toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
}
