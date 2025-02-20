import React from "react";
import FacultyTable from "./facultyTable";
import DependantTable from "./dependantTable";

export default function Admin() {
  return (
    <div>
      <FacultyTable />
      <DependantTable />
    </div>
  );
}
