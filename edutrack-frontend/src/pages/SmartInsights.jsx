import React, { useState, useEffect } from "react";
import smartInsightService from "../services/smartInsightService";
import { Sparkles, BrainCircuit, ShieldAlert, CheckCircle, Lightbulb } from "lucide-react";
import "../App.css";

function SmartInsights({ studentId }) {
    const [insights, setInsights] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (studentId) {
            loadInsights();
        }
    }, [studentId]);

    const loadInsights = async () => {
        setIsLoading(true);
        try {
            const data = await smartInsightService.getInsights(studentId);
            // Sort by generatedDate descending or id descending
            setInsights(data.reverse());
        } catch (error) {
            console.error("Error loading insights", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await smartInsightService.generateInsight(studentId);
            alert(res || "New advisor insight generated successfully!");
            loadInsights();
        } catch (error) {
            alert("Failed to compile AI insights. Make sure attendance records are logged.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="ai-insights-page">
            <div className="ai-insights-container">
                {/* AI advisor Header Card */}
                <div className="ai-header-card">
                    <div className="ai-glow-effect"></div>
                    <div className="ai-content">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                            <BrainCircuit size={28} color="#818cf8" />
                            <span 
                                style={{ 
                                    textTransform: "uppercase", 
                                    fontSize: "11px", 
                                    fontWeight: "700", 
                                    letterSpacing: "1.5px", 
                                    color: "#818cf8" 
                                }}
                            >
                                EduTrack AI Advisor
                            </span>
                        </div>
                        <h2>Predictive Performance Analytics</h2>
                        <p>
                            EduTrack AI scans your attendance percentages, examination grades, and overall profile activity 
                            to determine your risk level and compile recommendations to keep you on the path to success.
                        </p>
                        
                        <div className="ai-generate-section">
                            <button 
                                className="btn btn-ai-generate" 
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                <Sparkles size={16} /> 
                                {isGenerating ? "Analyzing Database..." : "Analyze & Generate AI Insights"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Insights Output */}
                <div className="dashboard-section">
                    <div className="dashboard-section-header">
                        <h2>Your Generated Advisor Reports</h2>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
                        {isLoading ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#6366f1", fontWeight: "600" }}>
                                Querying AI reports...
                            </div>
                        ) : insights.length > 0 ? (
                            insights.map((insight) => (
                                <div key={insight.id} className="insight-card">
                                    <div className="insight-card-header">
                                        <div className="insight-card-title">
                                            <h3>{insight.insightTitle}</h3>
                                            <span className="insight-date">Compiled on: {insight.generatedDate}</span>
                                        </div>
                                        <span 
                                            className={`badge-status ${insight.riskLevel === "HIGH" ? "badge-risk-high" : "badge-risk-low"}`}
                                        >
                                            {insight.riskLevel === "HIGH" ? (
                                                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                    <ShieldAlert size={14} /> High Risk
                                                </span>
                                            ) : (
                                                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                    <CheckCircle size={14} /> Low Risk
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    <div className={`insight-message ${insight.riskLevel === "HIGH" ? "high-risk" : "low-risk"}`}>
                                        {insight.insightMessage}
                                    </div>

                                    {insight.recommendedActions && (
                                        <div className="insight-actions">
                                            <h4 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <Lightbulb size={16} color="#d97706" /> Recommended Actions:
                                            </h4>
                                            <ul>
                                                {insight.recommendedActions.split(";").map((action, index) => (
                                                    <li key={index}>{action.trim()}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-insights">
                                <BrainCircuit size={48} style={{ color: "#cbd5e1", marginBottom: "12px", margin: "0 auto 12px auto" }} />
                                <h3>No AI advisory reports generated yet</h3>
                                <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "4px" }}>
                                    Click the "Analyze & Generate AI Insights" button above to run diagnostic checks.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SmartInsights;
