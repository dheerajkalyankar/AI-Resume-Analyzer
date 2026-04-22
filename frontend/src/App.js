import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const getScoreColor = (score) => {
    if (score > 70) return "bg-green-500";
    if (score > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreMessage = (score) => {
    if (score > 70) return "Excellent match 🔥";
    if (score > 40) return "Moderate match 👍";
    return "Low match ⚠️ Improve skills";
  };

  const handleSubmit = async () => {
    if (!file || !jd) {
      alert("Please upload resume and enter job description");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jd", jd);

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8001/analyze", formData);
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2">
          🚀 Smart Resume Matcher
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Analyze your resume against job descriptions instantly
        </p>

        {/* File Upload */}
        <input
          type="file"
          className="w-full border p-2 rounded-lg mb-2"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {file && (
          <p className="text-sm text-gray-600 mb-4">
            Selected: {file.name}
          </p>
        )}

        {/* Job Description */}
        <textarea
          className="w-full border p-3 rounded-lg mb-4"
          rows={5}
          placeholder="Paste Job Description"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-8">

            {/* Score */}
            <h2 className="text-xl font-semibold mb-1">
              Match Score: {result.match_score}%
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              {getScoreMessage(result.match_score)}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className={`${getScoreColor(result.match_score)} h-4 rounded-full`}
                style={{ width: `${result.match_score}%` }}
              ></div>
            </div>

            {/* Skill Match Info */}
            <p className="text-sm text-gray-500 mb-4">
              Matched {result.matched_skills.length} out of {result.jd_skills.length} required skills
            </p>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-4">

              {/* Matched */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-green-700 font-semibold mb-2">
                  Matched Skills
                </h3>
                <ul className="text-sm">
                  {result.matched_skills.map((s, i) => (
                    <li key={i}>✔ {s}</li>
                  ))}
                </ul>
              </div>

              {/* Missing */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-red-700 font-semibold mb-2">
                  Missing Skills
                </h3>
                <ul className="text-sm">
                  {result.missing_skills.map((s, i) => (
                    <li key={i}>✖ {s}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Recommendations */}
            <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Top Missing Skills</h3>
              <ul className="text-sm">
                {result.missing_skills.slice(0, 3).map((s, i) => (
                  <li key={i}>🚀 Learn {s}</li>
                ))}
              </ul>
            </div>

            {/* Summary */}
            <p className="mt-4 text-center font-medium text-gray-700">
              {result.summary}
            </p>

            {/* Clear Button */}
            <button
              onClick={() => setResult(null)}
              className="mt-4 text-sm text-blue-600 underline"
            >
              Clear Results
            </button>

          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Built with ❤️ using FastAPI + React + NLP
        </p>

      </div>
    </div>
  );
}

export default App;