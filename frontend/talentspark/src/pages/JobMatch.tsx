import { useState } from "react";
import { matchJobs, embedJobs, semanticSearch } from "../Services/RagService";
import type { JobMatchResult, SemanticSearchResult } from "../types/rag";

function JobMatch() {
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState("");
    const [matches, setMatches] = useState<JobMatchResult[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SemanticSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [embedMsg, setEmbedMsg] = useState("");

    const handleEmbed = async () => {
        setLoading(true);
        setEmbedMsg("");
        try {
            const result = await embedJobs();
            setEmbedMsg(result.message);
        } catch {
            setEmbedMsg("Failed to embed jobs. Is Qdrant running?");
        } finally {
            setLoading(false);
        }
    };

    const handleMatch = async () => {
        if (!skills.trim()) return;
        setLoading(true);
        setMatches([]);
        try {
            const result = await matchJobs(skills, experience);
            setMatches(result.matches);
        } catch {
            setMatches([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setSearchResults([]);
        try {
            const result = await semanticSearch(searchQuery);
            setSearchResults(result.results);
        } catch {
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="match-container">
            <h2 className="title">Smart Job Match</h2>

            {/* Step 1 */}
            <div className="match-section">
                <h3 className="match-section-title">
                    <span className="match-badge">Step 1</span> Embed Jobs into Vector DB
                </h3>
                <p style={{ fontSize: "0.95rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                    Click below to vector-embed all jobs from the database into Qdrant. This enables AI-powered semantic matching.
                </p>
                <button onClick={handleEmbed} disabled={loading} className="add-btn" style={{ marginTop: 0 }}>
                    {loading ? "Embedding Jobs..." : "Embed All Jobs"}
                </button>
                {embedMsg && (
                    <p style={{ marginTop: "1rem", color: "#10b981", fontWeight: 600, fontSize: "0.95rem" }}>
                        ⚡ {embedMsg}
                    </p>
                )}
            </div>

            {/* Step 2 */}
            <div className="match-section">
                <h3 className="match-section-title">
                    <span className="match-badge">Step 2</span> Semantic Job Search
                </h3>
                <p style={{ fontSize: "0.95rem", color: "var(--text)", marginBottom: "1rem" }}>
                    Search for jobs using natural language sentences or conceptual keywords.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search jobs... e.g. 'python backend developer with AWS'"
                        className="input"
                        style={{ flex: 1, minWidth: "250px" }}
                    />
                    <button 
                        onClick={handleSearch} 
                        disabled={loading || !searchQuery.trim()} 
                        className="add-btn"
                        style={{ marginTop: 0 }}
                    >
                        Search
                    </button>
                </div>
                {searchResults.length > 0 && (
                    <div className="match-results-list">
                        {searchResults.map((r, i) => (
                            <div key={i} className="match-result-item">
                                <div className="match-result-header">
                                    <strong>{r.title}</strong>
                                    <span className="match-score">Relevance: {Math.round(r.score * 100)}%</span>
                                </div>
                                <p style={{ margin: "0.5rem 0", color: "var(--text)", fontSize: "0.95rem" }}>
                                    {r.description}
                                </p>
                                <div style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>
                                    Salary: {r.salary}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Step 3 */}
            <div className="match-section">
                <h3 className="match-section-title">
                    <span className="match-badge">Step 3</span> Match Your Profile
                </h3>
                <p style={{ fontSize: "0.95rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                    Provide your skills and professional experiences to let the AI score and rank the best-fitting jobs.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.25rem" }}>
                    <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="Your skills... e.g. 'Python, React, PostgreSQL, Docker'"
                        className="input"
                    />
                    <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Your experience... e.g. '3 years of building full-stack web applications'"
                        className="input"
                    />
                </div>
                <button 
                    onClick={handleMatch} 
                    disabled={loading || !skills.trim()} 
                    className="add-btn"
                    style={{ marginTop: 0 }}
                >
                    {loading ? "Matching..." : "Find Matching Jobs"}
                </button>
                {matches.length > 0 && (
                    <div className="match-results-list">
                        <h4 style={{ margin: "1rem 0 0.5rem 0", color: "var(--text-h)", fontSize: "1.1rem", fontWeight: 600 }}>
                            Top Recommended Openings
                        </h4>
                        {matches.map((m, i) => {
                            const scoreClass = m.match_score > 75 ? "" : m.match_score > 40 ? "medium" : "low";
                            return (
                                <div key={i} className="match-result-item">
                                    <div className="match-result-header">
                                        <strong>{m.title}</strong>
                                        <span className={`match-score ${scoreClass}`}>
                                            {m.match_score}% Match
                                        </span>
                                    </div>
                                    <p style={{ margin: "0.5rem 0", color: "var(--text)", fontSize: "0.95rem" }}>
                                        {m.description}
                                    </p>
                                    <div style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>
                                        Salary: {m.salary}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default JobMatch;