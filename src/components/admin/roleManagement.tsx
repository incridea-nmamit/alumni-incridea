import { Role } from "@prisma/client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { DataTable } from "~/components/ui/data-table";
import PaginationControls from "~/components/utils/pagination/controls";
import { RoleColumns } from "./roleColumns";

type UserResponse = {
  users: {
    id: number;
    name: string | null;
    email: string;
    role: Role;
  }[];
  nextCursor?: number | null;
};

const RoleManagement = () => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newRole, setNewRole] = useState<Role>(Role.USER);
  const [pageNo, setPageNo] = useState<number>(0);

  const { data, fetchNextPage, isFetchingPreviousPage, isFetchingNextPage } =
    api.admin.getAllUsers.useInfiniteQuery(
      { take: 20 },
      { 
        getNextPageParam: (lastPage: UserResponse) => lastPage.nextCursor,
      },
    );

  const updateRole = api.admin.updateUserRole.useMutation({
    onSuccess: () => {
      setShowConfirmation(false);
    },
  });

  const handleRoleChange = (userId: number, role: Role) => {
    setSelectedUser(userId);
    setNewRole(role);
    setShowConfirmation(true);
  };

  const handleFetchNextPage = async () => {
    await fetchNextPage();
    setPageNo((prev) => prev + 1);
  };

  const confirmRoleChange = async () => {
    if (selectedUser !== null) {
      await updateRole.mutateAsync({ userId: selectedUser, newRole: newRole });
    }
  };

  const handleFetchPreviousPage = () => {
    setPageNo((prev) => prev - 1);
  };

  const currPage = data?.pages[pageNo]?.users ?? [];
  const nextCursor = data?.pages[pageNo]?.nextCursor;

  const tableData = currPage.map(user => ({
    id: user.id,
    name: user.name ?? '',
    email: user.email,
    role: user.role,
    onRoleChange: handleRoleChange
  }));

  return (
    <div className="container mx-auto py-10">
      <div className=" rounded-lg shadow p-4">
        <h2 className="text-3xl text-center font-bold mb-4 text-white">User Role Management</h2>
        <DataTable
          columns={RoleColumns}
          data={tableData}
          filterColumnId="email"
          filterPlaceHolder="Search by email"
          manualPagination
          paginationChild={
            <PaginationControls
              currPageNo={pageNo}
              handleFetchPreviousPage={handleFetchPreviousPage}
              handleFetchNextPage={handleFetchNextPage}
              disableNextButton={!nextCursor}
              disablePreviousButton={pageNo <= 0}
              isFetchingPreviousPage={isFetchingPreviousPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          }
        />
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-blue-800 p-6 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-4">Confirm Role Change</h3>
            <p>Are you sure you want to change this user&apos;s role?</p>
            <div className="mt-4 flex gap-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={confirmRoleChange}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-900"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
