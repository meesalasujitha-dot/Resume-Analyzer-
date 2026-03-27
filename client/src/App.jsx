import { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud, FileText, CheckCircle, AlertCircle, Sparkles, Loader2, ArrowRight } from "lucide-react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${API_URL}/upload`, formData);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error analyzing resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500/30 pb-20">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16 lg:py-24">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-2xl shadow-xl shadow-cyan-900/10 mb-2 border border-slate-700/50">
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text">
            AI Resume Analyzer
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Elevate your career with AI-driven insights. Upload your resume and get instant feedback on skills, keywords, and optimizations.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="grid gap-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          
          {/* Upload Card */}
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
            <div 
              className={`relative group border-2 border-dashed rounded-2xl p-10 transition-all duration-300 ease-in-out text-center ${
                dragActive 
                  ? "border-cyan-400 bg-cyan-400/5" 
                  : file ? "border-indigo-500/50 bg-indigo-500/5" : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/30"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc"
                onChange={handleChange}
              />
              
              <div className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
                <div className={`p-4 rounded-full transition-colors duration-300 ${file ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-700 text-slate-400 group-hover:bg-slate-600"}`}>
                  {file ? <FileText className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
                </div>
                
                <div className="space-y-1">
                  {file ? (
                    <>
                      <p className="text-lg font-medium text-slate-200">{file.name}</p>
                      <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-medium text-slate-200">
                        <span className="text-cyan-400 mr-1">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-sm text-slate-400">PDF or DOCX (Max 5MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className={`flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  !file || loading
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                } w-full sm:w-auto min-w-[200px]`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Resume
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              
              {/* Score Card */}
              <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl flex items-center justify-between flex-wrap gap-6 hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 flex items-center">
                    Resume Score
                  </h2>
                  <p className="text-slate-400 mt-1">Based on industry standards and keywords</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 md:w-64 h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 to-indigo-400">
                    {result.score}
                  </span>
                </div>
              </div>

              {/* Grid for Skills & Missing */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Skills Card */}
                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg mr-3 border border-emerald-500/20">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-200">Skills Found</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.skills?.length > 0 ? result.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-700/50 text-slate-300 text-sm font-medium rounded-lg border border-slate-600">
                        {skill}
                      </span>
                    )) : <p className="text-slate-500 text-sm">No specific skills detected.</p>}
                  </div>
                </div>

                {/* Missing Keywords Card */}
                <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center mb-6">
                    <div className="p-2 bg-rose-500/10 rounded-lg mr-3 border border-rose-500/20">
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-200">Missing Keywords</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords?.length > 0 ? result.missing_keywords.map((keyword, i) => (
                      <span key={i} className="px-3 py-1.5 bg-rose-500/10 text-rose-300 text-sm font-medium rounded-lg border border-rose-500/20">
                        {keyword}
                      </span>
                    )) : <p className="text-slate-500 text-sm">No critical keywords missing.</p>}
                  </div>
                </div>
              </div>

              {/* Suggestions Card */}
              <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-purple-500/10 rounded-lg mr-3 border border-purple-500/20">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200">Actionable Suggestions</h3>
                </div>
                <div className="space-y-4">
                  {result.suggestions?.length > 0 ? result.suggestions.map((suggestion, i) => (
                    <div key={i} className="flex bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                      <div className="min-w-[24px] text-cyan-500 font-bold mr-3">{i + 1}.</div>
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed">{suggestion}</p>
                    </div>
                  )) : <p className="text-slate-500">Your resume looks great! No major suggestions.</p>}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;