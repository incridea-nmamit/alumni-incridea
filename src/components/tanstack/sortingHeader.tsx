import { type Column } from "@tanstack/react-table";
import React from "react";
import { LuArrowDown, LuArrowUp, LuArrowUpDown } from "react-icons/lu";

import { Button } from "~/components/ui/button";

interface Props<TData> {
  column: Column<TData>;
  headerName: string;
}

const SortingHeader = <TData,>({ column, headerName }: Props<TData>) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {headerName}
      {column.getIsSorted() ? (
        column.getIsSorted() === "asc" ? (
          <LuArrowUp className="ml-2" />
        ) : (
          <LuArrowDown className="ml-2" />
        )
      ) : (
        <LuArrowUpDown className="ml-2" />
      )}
    </Button>
  );
};

export default SortingHeader;
