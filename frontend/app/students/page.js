"use client";
import { useState } from "react";
import StudentTable from "../../components/StudentTable";
import FilterDropdown from "../../components/UI/FilterDropdown";

export default function StudentsPage() {
  const [selectedDays, setSelectedDays] = useState(30);

  return (
    <div>
      <StudentTable selectedDays={selectedDays} />
    </div>
  );
}
