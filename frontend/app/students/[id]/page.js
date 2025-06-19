"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import axios from "axios";
import { MdHistory } from "react-icons/md";
import { FaBell, FaBellSlash } from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart, Bar
} from "recharts";


export default function StudentProfilePage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [contestHistory, setContestHistory] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [filterContestDays, setFilterContestDays] = useState(90);
  const [loading, setLoading] = useState(true);
  const [problemStats, setProblemStats] = useState(null);
  const [filterProblemsDays, setFilterProblemsDays] = useState(30);
  const [showProblems, setShowProblems] = useState(false);
  const [autoEmailDisabled, setAutoEmailDisabled] = useState(false);
  const [reminderCount, setReminderCount] = useState(0);
  const [savedTheme, setSavedTheme] = useState("light");

  // Initial fetch of student data, contests and problems
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-student/${id}`
        );
        const data = await res.json();
        setStudent(data);
        // console.log("Student Data:", data);

        const contestRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contests/${data.cf_handle}`
        );
        const contestData = await contestRes.json();
        setContestHistory(contestData.contests || []);
        // console.log("Contest History:", contestData.contests);

        const problemsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/problems/${data.cf_handle}?days=${filterProblemsDays}`
        );
        const problemsData = await problemsRes.json();
        setProblemStats(problemsData || []);
        // console.log("Problem Stats:", problemsData);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch student profile", err);
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id, filterProblemsDays]);

  useEffect(() => {
    // Theme setup (runs only once)
    const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
    setSavedTheme(theme);

    if (student && student._id) {
      // Debug log
      console.log("Student ID:", student._id);

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inactivity/fetch-auto-email/${student._id}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch auto-email status");
          return res.json();
        })
        .then(data => setAutoEmailDisabled(data.auto_email_disabled))
        .catch(err => {
          console.error("Error fetching auto-email status", err);
          setAutoEmailDisabled(false);
        });

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inactivity/reminder-count/${student._id}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch reminder count");
          return res.json();
        })
        .then(data => setReminderCount(data.reminder_count))
        .catch(err => {
          console.error("Error fetching reminder count", err);
          setReminderCount(0);
        });
    }
  }, [student]);

  // Fetch problems separately when filters change
  useEffect(() => {
    // console.log("Fetching problems with filter:", filterProblemsDays);
    const fetchProblems = async () => {
      try {
        // console.log("Fetching problems for:", student?.cf_handle, "Days:", filterProblemsDays);
        if (student?.cf_handle) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/problems/${student.cf_handle}?days=${filterProblemsDays}`
          );
          const data = await res.json();
          setProblemStats(data || []);
          // console.log("Problem Stats:", data);
        }
      } catch (err) {
        console.error("Failed to fetch problems", err);
        setProblemStats(null);
      }
    };




    if (showProblems && student?.cf_handle) {
      fetchProblems();
    }
  }, [showProblems, filterProblemsDays, student]);

  const changeProblemDays = (days) => {
    setFilterProblemsDays(days);
    setShowProblems(true);
  };

  // Prevent rendering until student is loaded
  if (loading || !student) {
    return <div className={`p-6 ${savedTheme === "dark" ? "text-white" : "text-black"}`}>Loading...</div>;
  }

  const handleToggleAutoEmail = async () => {
    if (!student || !student._id) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inactivity/auto-email/${student._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ disable: !autoEmailDisabled }),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setAutoEmailDisabled(data.auto_email_disabled);
    } catch (err) {
      console.error("Failed to toggle auto-email", err);
    }
    setLoading(false);
  };

  // Filter contests by selected days
  const now = new Date();
  const filteredContests = contestHistory.filter((contest) => {
    const contestDate = new Date(contest.time);
    const diffDays = (now - contestDate) / (1000 * 60 * 60 * 24);
    return diffDays <= filterContestDays;
  });

  const graphData = [...filteredContests]
    .sort((a, b) => new Date(a.time) - new Date(b.time))
    .map((c) => ({
      name: new Date(c.time).toLocaleDateString(),
      rating: c.newRating,
    }));

  return (
    <div className="py-2">
      {/* Basic Info */}
      <div className={`${savedTheme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"} p-6 rounded shadow`}>
        <h2 className={`text-2xl font-bold mb-2 ${savedTheme === "dark" ? "text-white" : "text-gray-950"}`}>
          {student.name + " Profile"}
        </h2>

        {student.email && (
          <p className={`text-sm mb-1 ${savedTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            <strong>Email:</strong> {student.email}
          </p>
        )}

        {student.phone && (
          <p className={`text-sm mb-1 ${savedTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            <strong>Mobile:</strong> {student.phone}
          </p>
        )}

        {student.cf_handle && (
          <p className={`text-sm mb-1 ${savedTheme === "dark" ? "text-gray-300" : "text-slate-950"}`}>
            <strong>CF Handle:</strong> <a
              href={`https://codeforces.com/profile/${student.cf_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {student.cf_handle}
            </a>
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {student.current_rating && (
            <StatCard
              title="Current Rating"
              value={student.current_rating}
              text={student.current_rank || "N/A"}
              textBg="text-black"
              cardBg="bg-blue-400"
            />
          )}

          {student.max_rating && (
            <StatCard
              title="Max Rating"
              value={student.max_rating}
              text={student.max_rank || "N/A"}
              textBg="text-black"
              cardBg="bg-gray-400"
            />
          )}

          {student.cf_contests && (
            <StatCard
              title="Contests"
              value={student.cf_contests}
              textBg="text-black"
              cardBg="bg-slate-300"
            />
          )}

          {student.cf_problems_solved && (
            <StatCard
              title="Problems Solved"
              value={student.cf_problems_solved}
              textBg="text-black"
              cardBg="bg-green-300"
            />
          )}
        </div>
      </div>

      {/* Toggle Button and Count */}
      <div className="my-4 flex items-center gap-4">

        <button
          onClick={handleToggleAutoEmail}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 
    ${autoEmailDisabled ? "bg-gray-400" : "bg-green-500"} 
    text-white shadow-md hover:scale-105 disabled:opacity-50`}
        >
          {autoEmailDisabled ? <FaBellSlash size={20} /> : <FaBell size={20} />}
          <span className="hidden sm:inline">
            {autoEmailDisabled ? "Inactivity Mail OFF" : "Inactivity Mail ON"}
          </span>
        </button>

        <span className="text-sm text-gray-700 dark:text-gray-300">
          Reminder Emails Sent: <strong>{reminderCount}</strong>
        </span>
      </div>

      {/* Contest History */}
      <div className="border rounded overflow-hidden">
        <button
          className={`w-full flex justify-between items-center px-4 py-2 text-lg font-semibold transition
      ${savedTheme === "dark"
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-100 text-black hover:bg-gray-200"}
    `}
          onClick={() => setShowStats(!showStats)}
        >
          <span>
            <MdHistory className="inline-block text-3xl" /> Contest History
          </span>
          {showStats ? (
            <FiChevronUp className="text-xl" />
          ) : (
            <FiChevronDown className="text-xl" />
          )}
        </button>

        {showStats && (
          <div className={`p-4 space-y-4 ${savedTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              {[30, 90, 365].map((days) => (
                <button
                  key={days}
                  className={`px-4 py-2 rounded font-medium transition 
              ${filterContestDays === days
                      ? "bg-blue-600 text-white"
                      : savedTheme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  onClick={() => setFilterContestDays(days)}
                >
                  Last {days} Days
                </button>
              ))}
            </div>

            {/* Rating Graph */}
            {filteredContests.length > 0 ? (
              graphData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={['dataMin - 50', 'dataMax + 50']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rating" stroke="#1f77b4" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-red-500">
                  No contest data found for selected range.
                </p>
              )
            ) : loading ? (
              <p className="text-gray-500">Loading contest data...</p>
            ) : (
              <p className="text-gray-500">
                No contests found in the last {filterContestDays} days.
              </p>
            )}

            {/* Contest Table */}
            {filteredContests.length > 0 && (
              <div className="overflow-x-auto">
                <table
                  className={`min-w-full border rounded text-sm ${savedTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
                    }`}
                >
                  <thead>
                    <tr className={`${savedTheme === "dark" ? "bg-gray-700" : "bg-gray-200"} text-left`}>
                      <th className="px-4 py-2 border">Date</th>
                      <th className="px-4 py-2 border">Contest</th>
                      <th className="px-4 py-2 border">Rank</th>
                      <th className="px-4 py-2 border">Old</th>
                      <th className="px-4 py-2 border">New</th>
                      <th className="px-4 py-2 border">Change</th>
                      <th className="px-4 py-2 border">Unsolved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContests.map((contest, index) => (
                      <tr
                        key={index}
                        className={`${savedTheme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-50"
                          }`}
                      >
                        <td className="px-4 py-2 border">
                          {new Date(contest.time).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 border">{contest.contestName}</td>
                        <td className="px-4 py-2 border">{contest.rank}</td>
                        <td className="px-4 py-2 border">{contest.oldRating}</td>
                        <td className="px-4 py-2 border">{contest.newRating}</td>
                        <td
                          className={`px-4 py-2 border ${contest.ratingChange >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                        >
                          {contest.ratingChange >= 0 ? "+" : ""}
                          {contest.ratingChange}
                        </td>
                        <td className="px-4 py-2 border">{contest.unsolvedProblems}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Problem Solving Stats  */}
      <div className="border rounded mt-5 overflow-hidden">
        <button
          className={`w-full flex justify-between items-center px-4 py-2 text-lg font-semibold transition
      ${savedTheme === "dark"
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-gray-100 text-black hover:bg-gray-200"}`}
          onClick={() => setShowProblems(!showProblems)}
        >
          <span>
            <MdHistory className="inline-block text-3xl" /> Problem Solving Data
          </span>
          {showProblems ? (
            <FiChevronUp className="text-xl" />
          ) : (
            <FiChevronDown className="text-xl" />
          )}
        </button>

        {showProblems && (
          <div className={`p-4 space-y-4 ${savedTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  className={`px-4 py-2 rounded font-medium transition 
              ${filterProblemsDays === days
                      ? "bg-blue-600 text-white"
                      : savedTheme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  onClick={() => setFilterProblemsDays(days)}
                >
                  Last {days} Days
                </button>
              ))}
            </div>

            {/* Problems Data Summary */}
            {problemStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {problemStats.totalSolved !== undefined && (
                    <div className={`${savedTheme === "dark" ? "bg-gray-900" : "bg-white"} p-4 rounded shadow`}>
                      <p className={`text-sm ${savedTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Total Solved</p>
                      <p className="text-lg font-bold">{problemStats.totalSolved}</p>
                    </div>
                  )}
                  <div className={`${savedTheme === "dark" ? "bg-gray-900" : "bg-white"} p-4 rounded shadow`}>
                    <p className={`text-sm ${savedTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Avg Rating</p>
                    <p className="text-lg font-bold">{problemStats.averageRating}</p>
                  </div>
                  <div className={`${savedTheme === "dark" ? "bg-gray-900" : "bg-white"} p-4 rounded shadow`}>
                    <p className={`text-sm ${savedTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Avg/Day</p>
                    <p className="text-lg font-bold">{problemStats.averagePerDay}</p>
                  </div>
                  {problemStats.mostDifficult && (
                    <div className={`${savedTheme === "dark" ? "bg-gray-900" : "bg-white"} p-4 rounded shadow`}>
                      <p className={`text-sm ${savedTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Hardest Problem</p>
                      <p className="text-lg font-bold">
                        {problemStats.mostDifficult.name} ({problemStats.mostDifficult.rating})
                      </p>
                    </div>
                  )}
                </div>

                {/* Rating Bucket Chart */}
                {problemStats.ratingBuckets && Object.keys(problemStats.ratingBuckets).length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-2">Problems by Rating</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart
                        data={Object.entries(problemStats.ratingBuckets).map(([rating, count]) => ({
                          rating,
                          count,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Submission Heatmap */}
                {/* Submission Heatmap */}
                {problemStats.submissionHeatmap && Object.keys(problemStats.submissionHeatmap).length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-2">Submission Heatmap (Last {filterProblemsDays} Days)</h4>
                    <div className="grid grid-cols-7 gap-1 text-xs text-center">
                      {Array.from({ length: filterProblemsDays }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (filterProblemsDays - 1 - i)); // dynamic window
                        const key = date.toISOString().split("T")[0];
                        const count = problemStats.submissionHeatmap[key] || 0;

                        const bgColor =
                          count === 0
                            ? savedTheme === "dark"
                              ? "bg-gray-700"
                              : "bg-gray-200"
                            : count < 2
                              ? "bg-green-300"
                              : count < 4
                                ? "bg-green-500"
                                : "bg-green-700";

                        return (
                          <div
                            key={key}
                            title={`${key}: ${count} submissions`}
                            className={`w-4 h-4 rounded ${bgColor}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <p className="text-gray-500">No problem-solving data found.</p>
            )}
          </div>
        )}
      </div>
    </div >
  );
}


function StatCard({ title, value, text, cardBg, textBg }) {
  return (
    <div className={`w-full rounded-xl p-4 shadow ${cardBg} ${textBg} border border-gray-400`}>
      <div className="text-sm">{title} </div>
      <div className="text-2xl font-bold">
        {value} {text && <span className="text-sm">({text})</span>}
      </div>
    </div>
  );
}