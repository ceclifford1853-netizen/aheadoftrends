import React, { useEffect, useState } from 'react';
import { Shield, Users, BarChart3, ExternalLink } from 'lucide-react';

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching from the aeo router established by Manus
  useEffect(() => {
    fetch('/api/trpc/aeo.getLeads')
      .then(res => res.json())
      .then(data => {
        setLeads(data.result?.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Admin fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-[#00f0ff]/20 pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-[#00f0ff] drop-shadow-[0_0_10px_#00f0ff]">
              COMMAND_CENTER
            </h1>
            <p className="text-gray-400 mt-2">Ahead of Trends // Administrative Oversight</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#111] border border-[#00f0ff]/30 p-4 rounded-lg">
              <span className="text-xs text-gray-500 block uppercase">Total Leads</span>
              <span className="text-2xl font-mono text-[#00f0ff]">{leads.length}</span>
            </div>
          </div>
        </div>

        {/* Lead Table */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[#ff00aa] uppercase text-xs tracking-widest">
                <th className="p-4 border-b border-white/10">Timestamp</th>
                <th className="p-4 border-b border-white/10">Target URL</th>
                <th className="p-4 border-b border-white/10">AEO Score</th>
                <th className="p-4 border-b border-white/10">Status</th>
                <th className="p-4 border-b border-white/10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center animate-pulse text-[#00f0ff]">Syncing Database...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-gray-400">No leads yet</td></tr>
              ) : leads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-400 font-mono text-sm">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-medium truncate">{lead.url}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${lead.overall > 70 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {lead.overall}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                      Captured
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-[#00f0ff] hover:text-white transition-colors">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
