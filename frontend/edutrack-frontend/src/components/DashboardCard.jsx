import React from "react";
import "../App.css";

function DashboardCard({ label, value, icon, color }) {
    const getBgColorClass = () => {
        switch (color) {
            case "blue": return { bg: "#eff6ff", text: "#2563eb" };
            case "emerald": return { bg: "#ecfdf5", text: "#059669" };
            case "amber": return { bg: "#fffbeb", text: "#d97706" };
            case "indigo": return { bg: "#eef2ff", text: "#4f46e5" };
            case "rose": return { bg: "#fff1f2", text: "#e11d48" };
            default: return { bg: "#f1f5f9", text: "#475569" };
        }
    };

    const colors = getBgColorClass();

    return (
        <div className="stat-card">
            <div 
                className="stat-card-icon-wrapper" 
                style={{ backgroundColor: colors.bg, color: colors.text }}
            >
                {icon}
            </div>
            <div className="stat-card-info">
                <span className="stat-card-label">{label}</span>
                <span className="stat-card-value">{value}</span>
            </div>
        </div>
    );
}

export default DashboardCard;
