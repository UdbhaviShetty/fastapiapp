import { useState } from "react";
import { analyseResume } from "../Services/RagService";

function ResumeAnalyser() {
    const [resumeText, setResumeText] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAnalyse = async () => {
        if (!resumeText.trim()) return;
        setLoading(true);
        setAnalysis("");
        try {
            const result = await analyseResume(resumeText);
            setAnalysis(result.analysis);
        } catch {
            setAnalysis("Failed to analyse resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resume-container">
            <h2 className="title">Resume Analyser</h2>
            <p style={{ color: "var(--text)", marginBottom: "0.5rem" }}>
                Paste the text content of your resume below to get instant feedback and structural analysis from our Career AI.
            </p>
            <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="input resume-textarea"
                disabled={loading}
            />
            <button
                onClick={handleAnalyse}
                disabled={loading || !resumeText.trim()}
                className="add-btn"
                style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
            >
                {loading ? "Analysing Resume..." : "Analyse Resume"}
            </button>

            {analysis && (
                <div className="resume-result-card">
                    <h3 className="resume-result-title">⚡ Analysis Result</h3>
                    <p className="resume-result-text">{analysis}</p>
                </div>
            )}
        </div>
    );
}

export default ResumeAnalyser;