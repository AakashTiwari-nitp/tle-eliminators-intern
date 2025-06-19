// AddCronModal.jsx
import { useState } from "react";

export default function AddCronModal({ isOpen, onClose, onAdded, apiUrl }) {
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

function toAmPm(time) {
  if (/am|pm/i.test(time)) return time.trim();

  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) {
    return ""; // Invalid input, handled gracefully
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute.toString().padStart(2, "0")} ${suffix}`;
}

const handleAdd = async () => {
  setLoading(true);
  setError("");

  try {
    const formattedTime = toAmPm(time);

    if (!formattedTime) throw new Error("Invalid time format. Use HH:MM (24-hour or AM/PM)");

    const res = await fetch(`${apiUrl}/api/cron/add-cf-cron`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time: formattedTime }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add cron");

    setTime("");
    onClose();
  } catch (err) {
    setError(err.message);
  }

  setLoading(false);
};

  return (
    <div className="fixed inset-0 bg-black text-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-lg font-semibold mb-2">Add Cron Time</h2>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="e.g. 2:30 PM"
          value={time}
          onChange={e => setTime(e.target.value)}
          disabled={loading}
        />
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-green-600 text-white"
            onClick={handleAdd}
            disabled={loading}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}