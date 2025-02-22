import React from "react";
import AlumniTable from "./alumniTable";
import RoleManagement from "./roleManagement";

export default function Admin() {
  return (
    <div className="min-w-full mt-28 pb-8">
      <div className="max-w-[98%] mx-auto">
        <div className="w-full">
          <h1 className="text-3xl text-white text-center font-bold mb-8">Alumni Registration Data</h1>
          <div className="overflow-x-auto">
            <AlumniTable />
          </div>
          <RoleManagement />
        </div>
      </div>
    </div>
  );
}
