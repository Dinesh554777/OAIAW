'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AssessmentReportPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'diff' | 'ai'>('timeline');

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await api.get(`/sessions/${sessionId}/report`);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [sessionId]);

  if (loading) return <div className="p-8 text-white">Loading report...</div>;
  if (!report) return <div className="p-8 text-red-400">Failed to load report.</div>;

  const { session, evaluation, evidence, events, git_history, git_diff, messages, ai_summary } = report;

  const [generatingAI, setGeneratingAI] = useState(false);

  const handleGenerateAI = async () => {
    setGeneratingAI(true);
    try {
      const data = await api.post(`/sessions/${sessionId}/generate-ai-summary`);
      setReport({ ...report, ai_summary: data });
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAI(false);
    }
  };

  // Simple custom diff renderer
  const renderDiff = (diffText: string) => {
    if (!diffText) return <div className="text-gray-500 italic">No changes detected.</div>;
    return diffText.split('\n').map((line, i) => {
      let colorClass = 'text-gray-300';
      let bgClass = '';
      if (line.startsWith('+')) {
        colorClass = 'text-green-400';
        bgClass = 'bg-green-900/20';
      } else if (line.startsWith('-')) {
        colorClass = 'text-red-400';
        bgClass = 'bg-red-900/20';
      } else if (line.startsWith('@@')) {
        colorClass = 'text-blue-400';
        bgClass = 'bg-blue-900/20';
      }
      return (
        <div key={i} className={`font-mono text-sm whitespace-pre-wrap ${colorClass} ${bgClass} px-2`}>
          {line}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-8">
      {/* Header */}
      <header className="mb-8 border-b border-slate-800 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Assessment Report</h1>
          <p className="text-slate-400">Candidate: <span className="text-cyan-400 font-semibold">{session.candidate_name}</span></p>
          <p className="text-slate-400">Task: {session.task_title}</p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${session.status === 'SUBMITTED' ? 'bg-cyan-900 text-cyan-300' : 'bg-yellow-900 text-yellow-300'}`}>
            {session.status}
          </span>
          <p className="text-sm text-slate-500 mt-2">ID: {session.id}</p>
        </div>
      </header>

      {/* AI Summary Panel */}
      <section className="mb-10 bg-indigo-950/20 border border-indigo-900 rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-indigo-400">🤖</span> AI Assessment Assistant
          </h2>
          {!ai_summary && (
            <button 
              onClick={handleGenerateAI}
              disabled={generatingAI}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium text-sm transition-colors disabled:opacity-50"
            >
              {generatingAI ? 'Generating...' : 'Generate AI Summary'}
            </button>
          )}
        </div>
        
        {ai_summary ? (
          <div>
            <div className="bg-indigo-900/40 text-indigo-200 text-xs py-1 px-3 rounded inline-block mb-4 border border-indigo-800">
              AI-generated summary based on observable assessment evidence.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-indigo-300 font-medium mb-1 text-sm">Task Summary</h3>
                <p className="text-slate-300 text-sm mb-4">{ai_summary.task_summary}</p>
                
                <h3 className="text-indigo-300 font-medium mb-1 text-sm">Implementation</h3>
                <p className="text-slate-300 text-sm">{ai_summary.implementation_summary}</p>
              </div>
              <div>
                <h3 className="text-indigo-300 font-medium mb-1 text-sm">Testing Summary</h3>
                <p className="text-slate-300 text-sm mb-4">{ai_summary.testing_summary}</p>
                
                <h3 className="text-indigo-300 font-medium mb-1 text-sm">AI Usage & Debugging</h3>
                <p className="text-slate-300 text-sm">{ai_summary.ai_usage_summary} {ai_summary.debugging_summary}</p>
              </div>
            </div>
            
            <h3 className="text-indigo-300 font-medium mb-2 text-sm border-t border-indigo-900/50 pt-4">Observable Evidence Points</h3>
            <ul className="space-y-2">
              {JSON.parse(ai_summary.evidence_points).map((pt: any, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span className="text-slate-300 text-sm flex-1">{pt.description}</span>
                  {pt.event_ids.length > 0 && (
                    <button 
                      onClick={() => {
                        setActiveTab('timeline');
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                    >
                      View Event(s)
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">Click generate to produce a structured, evidence-grounded summary of the candidate's performance.</p>
        )}
      </section>

      {/* Evaluation Summary */}
      {evaluation && (
        <section className="mb-10 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-indigo-400">⚡</span> Evaluation Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evaluation.results.map((res: any, idx: number) => (
              <div key={idx} className={`p-4 rounded-lg border ${res.status === 'PASS' ? 'bg-green-950/30 border-green-900' : 'bg-red-950/30 border-red-900'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-slate-200">{res.test_case_id}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${res.status === 'PASS' ? 'text-green-400 bg-green-900/50' : 'text-red-400 bg-red-900/50'}`}>
                    {res.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{res.output_summary}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Evidence Cards */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">Derived Evidence</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {evidence.map((ev: any, idx: number) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-cyan-500/50 transition-colors">
              <div className="text-xs text-indigo-400 font-mono mb-2">{ev.evidence_type}</div>
              <p className="text-sm text-slate-300">{ev.description}</p>
            </div>
          ))}
          {evidence.length === 0 && <p className="text-slate-500 text-sm">No evidence patterns derived yet.</p>}
        </div>
      </section>

      {/* Interactive Tabs */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="flex border-b border-slate-800 bg-slate-950">
          <button 
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'timeline' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setActiveTab('timeline')}
          >
            Engineering Timeline
          </button>
          <button 
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'diff' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setActiveTab('diff')}
          >
            Git Diff Viewer
          </button>
          <button 
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'ai' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900' : 'text-slate-500 hover:text-slate-300'}`}
            onClick={() => setActiveTab('ai')}
          >
            AI Interactions
          </button>
        </div>

        <div className="p-6">
          {/* TIMELINE TAB */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
              {events.map((evt: any, idx: number) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800 text-slate-300 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    {evt.event_type.includes('TEST') ? '🧪' : evt.event_type.includes('FILE') ? '📝' : '🤖'}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-slate-800 bg-slate-900/50 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-cyan-400 text-sm">{evt.event_type}</div>
                      <time className="font-mono text-xs text-slate-500">{new Date(evt.timestamp).toLocaleTimeString()}</time>
                    </div>
                    <div className="text-slate-300 text-sm">{evt.metadata_json}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DIFF TAB */}
          {activeTab === 'diff' && (
            <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto">
              <div className="p-4 border-b border-slate-800 flex justify-between bg-slate-900">
                <span className="text-sm font-mono text-slate-400">git diff HEAD~1</span>
              </div>
              <div className="p-4">
                {renderDiff(git_diff)}
              </div>
            </div>
          )}

          {/* AI TAB */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              {messages.map((msg: any, idx: number) => (
                <div key={idx} className={`p-4 rounded-lg border ${msg.role === 'USER' ? 'bg-slate-800 border-slate-700 ml-12' : 'bg-indigo-950/30 border-indigo-900 mr-12'}`}>
                  <div className="text-xs font-bold text-slate-400 mb-2">{msg.role}</div>
                  <div className="text-sm whitespace-pre-wrap text-slate-200">{msg.content}</div>
                </div>
              ))}
              {messages.length === 0 && <p className="text-slate-500 text-center py-8">No AI interactions recorded.</p>}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
