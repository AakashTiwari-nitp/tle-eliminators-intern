"use client";
import { useEffect, useState } from "react";
import RatingGraph from "./Charts/RatingGraph";
import DifficultyBarChart from "./Charts/DifficultyBarChart";
import SubmissionHeatmap from "./Charts/SubmissionHeatmap";
import axios from "axios";

export default function StudentProfile({ student }) {
  const [savedTheme, setSavedTheme] = useState("light");
  const [autoEmailDisabled, setAutoEmailDisabled] = useState(false);
  const [reminderCount, setReminderCount] = useState(0);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  // Theme setup (runs only once)
  const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
  setSavedTheme(theme);

  if (student && student._id) {
    // Debug log
    console.log("Student ID:", student._id);

    axios.get(`/api/inactivity/fetch-auto-email/${student._id}`)
      .then(res => setAutoEmailDisabled(res.data.auto_email_disabled))
      .catch(err => {
        console.error("Error fetching auto-email status", err);
        setAutoEmailDisabled(false);
      });

    axios.get(`/api/inactivity/reminder-count/${student._id}`)
      .then(res => setReminderCount(res.data.reminder_count))
      .catch(err => {
        console.error("Error fetching reminder count", err);
        setReminderCount(0);
      });
  }
}, [student]);

  const handleToggleAutoEmail = async () => {
    if (!student || !student._id) return;

    setLoading(true);
    try {
      const res = await axios.patch(`/api/inactivity/auto-email/${student._id}`, {
        disable: !autoEmailDisabled,
      });
      setAutoEmailDisabled(res.data.auto_email_disabled);
    } catch (err) {
      console.error("Failed to toggle auto-email", err);
    }
    setLoading(false);
  };

  const mainBg = savedTheme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const cardBg = savedTheme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const sectionBg = savedTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";

  if (!student) return <p className="p-4 text-center text-lg">Loading student profile...</p>;

  return (
    <div className={`space-y-6 ${mainBg}`}>
      <div className={`relative p-4 rounded shadow ${cardBg}`}>
        {/* Optional Nutto Badge */}
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow">Nutto</div>

        <h2 className="text-2xl font-semibold mb-2">Student Profile</h2>
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone:</strong> {student.phone}</p>
        <p><strong>Codeforces Handle:</strong> {student.cf_handle}</p>
        <p><strong>Current Rating:</strong> {student.current_rating}</p>
        <p><strong>Max Rating:</strong> {student.max_rating}</p>
        <p><strong>Current Rank:</strong> {student.current_rank}</p>
        <p><strong>Max Rank:</strong> {student.max_rank}</p>
        <p><strong>Contests:</strong> {student.cf_contests}</p>
        <p><strong>Problems Solved:</strong> {student.cf_problems_solved}</p>

        {/* Toggle Button and Count */}
        <div className="mt-4 flex items-center gap-4">
          <button
            className={`px-4 py-2 rounded font-semibold ${autoEmailDisabled ? "bg-red-500" : "bg-green-500"} text-white ${loading ? "opacity-50" : ""}`}
            onClick={handleToggleAutoEmail}
            disabled={loading}
          >
            Inactivity Mail: {autoEmailDisabled ? "OFF" : "ON"}
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Reminder Emails Sent: <strong>{reminderCount}</strong>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className={`p-4 rounded shadow ${sectionBg}`}>
          <h3 className="text-lg font-medium mb-2">Rating Graph</h3>
          <RatingGraph rating={student.current_rating} />
        </div>

        <div className={`p-4 rounded shadow ${sectionBg}`}>
          <h3 className="text-lg font-medium mb-2">Difficulty Breakdown</h3>
          <DifficultyBarChart />
        </div>
      </div>

      <div className={`p-4 rounded shadow ${sectionBg}`}>
        <h3 className="text-lg font-medium mb-2">Submission Heatmap</h3>
        <SubmissionHeatmap />
      </div>
    </div>
  );
}
