import {
    BarChart3,
    Users,
    ClipboardCheck,
    Brain,
    Trophy,
    FileText
} from "lucide-react";

import "./Features.css";

const features = [

    {
        icon: <BarChart3 size={34} />,
        title: "Live Analytics",
        description:
            "Department, semester and cohort-level insights updated in real time."
    },

    {
        icon: <Users size={34} />,
        title: "Student Management",
        description:
            "Search, filter and manage the full student roster with rich profiles."
    },

    {
        icon: <ClipboardCheck size={34} />,
        title: "Attendance Tracking",
        description:
            "Automatic monthly trends and low-attendance alerts for early action."
    },

    {
        icon: <Brain size={34} />,
        title: "Smart Insights",
        description:
            "AI-powered risk prediction identifies students needing mentoring."
    },

    {
        icon: <Trophy size={34} />,
        title: "Achievements",
        description:
            "Recognize top performers with badges and academic milestones."
    },

    {
        icon: <FileText size={34} />,
        title: "Reports",
        description:
            "Generate attendance and academic reports in a single click."
    }

];

function Features() {

    return (

        <section
            className="features"
            id="features"
        >

            <p className="section-tag">
                Platform
            </p>

            <h2>
                Everything your institution needs,
                <br />
                in one place
            </h2>

            <p className="section-description">
                From live dashboards to risk prediction,
                EduTrack replaces spreadsheets with a
                modern academic command center.
            </p>

            <div className="feature-grid">

                {
                    features.map((feature, index) => (

                        <div
                            className="feature-card"
                            key={index}
                        >

                            <div className="feature-icon">
                                {feature.icon}
                            </div>

                            <h3>
                                {feature.title}
                            </h3>

                            <p>
                                {feature.description}
                            </p>

                        </div>

                    ))
                }

            </div>

        </section>

    );

}

export default Features;