import React from "react";
import AlumniTable from "./alumniTable";
import RoleManagement from "./roleManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const Admin = () => {
  return (
    <div className="min-w-full h-full" >
      <h1 className="text-white text-3xl font-bold text-center my-2">Admin Panel</h1>
      <div className="max-w-[98%] h-full mx-auto">
        <Tabs defaultValue="alumni" className="size-full">
          <TabsList className="w-full">
            <TabsTrigger className="data-[state=active]:bg-blue-700 data-[state=active]:text-white w-2/5 data-[state=active]:w-3/5" value="alumni">Alumni Management</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-blue-700 data-[state=active]:text-white w-2/5 data-[state=active]:w-3/5" value="role">Role Management</TabsTrigger>
          </TabsList>
          <TabsContent className="h-full" value="alumni">
            <AlumniTable />
          </TabsContent>
          <TabsContent className="h-full" value="role">
            <RoleManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div >
  );
}

export default Admin;
