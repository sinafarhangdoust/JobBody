import { useState } from 'react';
import Header from './components/Header';

export default function Settings() {
  const [resume, setResume] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // TODO: Send this data to your backend API
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFBF7] text-[#2D3748] overflow-hidden font-sans selection:bg-[#E6AA68] selection:text-white">

      {/* Header without Search Bar */}
      <Header showSearch={false} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">

          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-[#2D3748] mb-2">Profile & Agent Settings</h2>
            <p className="text-[#2D3748]/60 font-medium">Teach your AI agent how to scout the perfect jobs for you.</p>
          </div>

          {/* Resume Section */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-[#2D3748]/5 relative overflow-hidden group hover:border-[#E6AA68]/30 transition-colors">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#2D3748]"></div>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📄</span>
                <h3 className="text-xl font-bold text-[#2D3748]">Your Resume</h3>
            </div>
            <p className="text-sm text-[#2D3748]/60 mb-4">Paste your resume text here. The agent will use this to match your skills against job descriptions.</p>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className="w-full h-64 bg-[#FDFBF7] border-2 border-[#2D3748]/10 rounded-xl p-4 font-mono text-sm focus:border-[#E6AA68] focus:ring-4 focus:ring-[#E6AA68]/10 outline-none transition-all resize-none"
              placeholder="Paste your full resume content here..."
            />
          </div>

          {/* Instructions Section */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-[#2D3748]/5 relative overflow-hidden group hover:border-[#E6AA68]/30 transition-colors">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#E6AA68]"></div>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🤖</span>
                <h3 className="text-xl font-bold text-[#2D3748]">Agent Instructions</h3>
            </div>
            <p className="text-sm text-[#2D3748]/60 mb-4">Give specific instructions for filtering. (e.g. "Avoid jobs that require C++", "Prioritize remote roles", "I love startups").</p>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full h-40 bg-[#FDFBF7] border-2 border-[#2D3748]/10 rounded-xl p-4 font-medium text-sm focus:border-[#E6AA68] focus:ring-4 focus:ring-[#E6AA68]/10 outline-none transition-all resize-none"
              placeholder="e.g. Ignore any job that mentions 'Java' or 'Legacy Code'. Focus on AI and Machine Learning roles."
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#2D3748] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[#E6AA68] hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
              {!isSaving && <span>💾</span>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}