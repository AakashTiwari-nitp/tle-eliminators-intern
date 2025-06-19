import { useEffect, useState } from "react";

export default function ViewCronModal({ isOpen, onClose, apiUrl }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    fetch(`${apiUrl}/api/cron/list-cf-cron`)
      .then(res => res.json())
      .then(data => {
        const raw = data.schedules || [];
        const formatted = raw.map(time => ({
          original: time,
          display: cronToAmPm(time),
        }));
        setSchedules(formatted);
      })
      .catch(() => setSchedules([]))
      .finally(() => setLoading(false));
  }, [isOpen, apiUrl]);

  function cronToAmPm(cronTime) {
    const parts = cronTime.trim().split(" ");
    if (parts.length < 2) return "";

    const minute = parseInt(parts[0], 10);
    const hour = parseInt(parts[1], 10);

    if (isNaN(hour) || isNaN(minute)) return "";

    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minute.toString().padStart(2, "0")} ${suffix}`;
  }

  const handleRemove = async (displayTime) => {
  setRemoveLoading(displayTime);
  setError("");

  try {
    const res = await fetch(`${apiUrl}/api/cron/remove-cf-cron`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time: cronToAmPm(displayTime) }), 
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to remove cron");

    // Update state with latest formatted list
    const updated = (data.schedules || []).map(t => ({
      original: t,
      display: cronToAmPm(t),
    }));
    setSchedules(updated);
  } catch (err) {
    setError(err.message);
  }

  setRemoveLoading("");
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-96 text-black">
        <h2 className="text-lg font-semibold mb-2">Current Cron Schedules</h2>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul className="mb-2">
            {schedules.length === 0 && <li className="text-gray-500">No schedules set.</li>}
            {schedules.map((item) => (
              <li key={item.original} className="flex items-center justify-between mb-1">
                <span>{item.display}</span>
                <button
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                  onClick={() => handleRemove(item.original)}
                  disabled={removeLoading === item.original}
                >
                  {removeLoading === item.original ? "Removing..." : "Remove"}
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

        <div className="flex justify-end">
          <button className="px-3 py-1 rounded bg-gray-300" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
