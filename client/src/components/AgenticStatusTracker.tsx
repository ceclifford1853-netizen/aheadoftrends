import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AgentStage = 'idle' | 'active' | 'complete';

interface AgentNode {
  id: 'scout' | 'architect' | 'ghostwriter' | 'auditor';
  label: string;
  icon: string;
  description: string;
}

const AGENT_NODES: AgentNode[] = [
  { id: 'scout', label: 'Scout', icon: '🔍', description: 'Scanning real-time AEO signals & trend data' },
  { id: 'architect', label: 'Architect', icon: '🏗️', description: 'Structuring EEAT-optimized content framework' },
  { id: 'ghostwriter', label: 'Ghostwriter', icon: '✍️', description: 'Generating high-authority technical content' },
  { id: 'auditor', label: 'Auditor', icon: '✅', description: 'Validating AI-readiness & accuracy' },
];
export function AgenticStatusTracker({ isActive = false }: { isActive?: boolean }) {
  const [stages, setStages] = useState<Record<string, AgentStage>>(
    Object.fromEntries(AGENT_NODES.map(n => [n.id, 'idle']))
  );

  useEffect(() => {
    if (!isActive) return;
    
    let delay = 0;
    AGENT_NODES.forEach((node, index) => {
      setTimeout(() => {
        setStages(prev => ({ ...prev, [node.id]: 'active' }));
        setTimeout(() => {
          setStages(prev => ({ ...prev, [node.id]: 'complete' }));
          if (index < AGENT_NODES.length - 1) {
            const next = AGENT_NODES[index + 1].id;
            setStages(prev => ({ ...prev, [next]: 'active' }));
          }
        }, 1800);
      }, delay);
      delay += 2200;
    });
  }, [isActive]);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-8">
      <div className="absolute top-8 left-0 right-0 h-0.5 bg-slate-800">
        <motion.div 
          className="h-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, ease: "linear" }}
        />
      </div>

      <div className="relative flex justify-between">
        {AGENT_NODES.map((node) => {
          const stage = stages[node.id];
          const isComplete = stage === 'complete';
          const isActiveStage = stage === 'active';
          
          return (
            <motion.div
              key={node.id}
              className="flex flex-col items-center z-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: isActiveStage ? 1.1 : 1, 
                opacity: 1,
                boxShadow: isActiveStage                   ? "0 0 20px rgba(34,211,238,0.8)" 
                  : isComplete 
                    ? "0 0 12px rgba(34,211,238,0.4)" 
                    : "none"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2
                  ${isComplete ? 'bg-cyan-900/30 border-cyan-400 text-cyan-300' : 
                    isActiveStage ? 'bg-cyan-500/20 border-cyan-300 text-cyan-100 animate-pulse' : 
                    'bg-slate-900 border-slate-700 text-slate-500'}`}
              >
                {node.icon}
              </motion.div>
              
              <span className={`mt-3 text-sm font-medium font-dm-mono
                ${isComplete || isActiveStage ? 'text-cyan-300' : 'text-slate-500'}`}>
                {node.label}
              </span>
              
              <AnimatePresence>
                {(isActiveStage || isComplete) && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-xs text-slate-400 text-center max-w-[140px] font-inter"
                  >
                    {node.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
