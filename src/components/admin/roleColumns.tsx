import { Role } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

type RoleUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  onRoleChange: (userId: number, role: Role) => void;
};

export const RoleColumns: ColumnDef<RoleUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Current Role",
  },
  {
    id: "actions",
    header: "Update Role",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <select
          className="rounded-md p-3 border-white bg-blue-800 text-white shadow-sm focus:border-blue-600 focus:ring-blue-600"
          value={user.role}
          onChange={(e) => user.onRoleChange(user.id, e.target.value as Role)}
        >
          {Object.values(Role).map((role) => (
            <option key={role} value={role} className="bg-blue-900">
              {role}
            </option>
          ))}
        </select>
      );
    },
  },
];
