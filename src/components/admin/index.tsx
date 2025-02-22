import React from "react";
import AlumniTable from "./alumniTable";

export default function Admin() {
  return (
    <div className="min-w-full mt-28 pb-8 bg-blue-800">
      <div className="max-w-[98%] mx-auto overflow-x-auto">
        <div className="w-full min-w-max">
          <AlumniTable />
        </div>
      </div>
    </div>
  );
}
