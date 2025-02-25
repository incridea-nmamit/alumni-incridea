"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { type ReactNode } from "react";
import { LuColumns2, LuDownload, LuFilter } from "react-icons/lu";

import { cn } from "~/lib/utils";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Input } from "./input";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNextButton,
  PaginationPreviousButton,
} from "./pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface PropsBase<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  headerChild?: ReactNode;
  // filterColumnId must match a id from the columns passed as prop
  filterColumnId?: string;
  filterPlaceHolder?: string;
  // In the case where one wants to customize the filters
  // Please use this if there are more than 2 or 3 filters
  noFilterSheet?: boolean;
}

interface PropsWithManualPagination<TData, TValue>
  extends PropsBase<TData, TValue> {
  manualPagination: true;
  paginationChild?: ReactNode;
}

interface PropsWithoutManualPagination<TData, TValue>
  extends PropsBase<TData, TValue> {
  manualPagination?: false;
  paginationChild?: never;
}

type DataTableProps<TData, TValue> =
  | PropsWithManualPagination<TData, TValue>
  | PropsWithoutManualPagination<TData, TValue>;

export function DataTable<TData, TValue>({
  columns,
  data,
  headerChild,
  filterColumnId,
  filterPlaceHolder,
  noFilterSheet = false,
  manualPagination = false,
  paginationChild,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: manualPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex justify-between gap-3 py-4">
        {headerChild && (
          <div>
            <div
              className={cn(
                "flex items-center gap-3",
                !noFilterSheet && "hidden xl:flex",
              )}
            >
              {headerChild}
            </div>

            {!noFilterSheet && (
              <Sheet>
                <SheetTrigger className="block xl:hidden" asChild>
                  <Button variant="outline">
                    <LuFilter />
                  </Button>
                </SheetTrigger>
                <SheetContent className="max-w-lg">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Apply to change the results
                    </SheetDescription>
                    <div className="flex flex-col items-start justify-center gap-5 pt-5">
                      {headerChild}
                    </div>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            )}
          </div>
        )}

        <div className="flex w-full items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <span className="hidden md:inline">Columns</span>
                <LuColumns2 className="md:ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(e) => e.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {filterColumnId && (
            <Input
              placeholder={filterPlaceHolder ?? "Search"}
              value={
                (table.getColumn(filterColumnId)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(filterColumnId)
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          )}
        </div>
      </div>

      <div className="relative flex-1 overflow-auto rounded-md border bg-blue-900 text-white shadow-md">
        <Table>
          <TableHeader className="sticky top-0 bg-blue-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 py-4 md:flex-row">
        <div className="order-2 w-fit text-sm text-muted-foreground md:order-1 md:w-1/3">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {manualPagination
            ? table.getRowModel().rows.length
            : Math.min(
                table.getFilteredRowModel().rows.length,
                table.getState().pagination.pageSize,
              )}{" "}
          row(s) selected
        </div>

        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="order-3 w-fit md:order-2 md:w-1/3">
            <Button
              className="mx-auto flex"
              variant="outline"
              size="sm"
              onClick={() => {
                console.log(table);

                let csvString = "";

                table
                  .getFilteredSelectedRowModel()
                  .rows[0]?.getVisibleCells()
                  .map((cell) => {
                    if (
                      cell.column.id !== "select" &&
                      cell.column.id !== "actions"
                    )
                      csvString += cell.column.id + ",";
                  });

                csvString += "\n";

                table.getFilteredSelectedRowModel().rows.map((row) => {
                  row.getVisibleCells().map((cell) => {
                    if (
                      cell.column.id !== "select" &&
                      cell.column.id !== "actions"
                    )
                      csvString += (cell.getValue() as string) + ",";
                  });

                  csvString += "\n";
                });

                const anchorElement = document.createElement("a");
                const blob = new Blob([csvString], { type: "text/csv" });

                anchorElement.href = URL.createObjectURL(blob);
                anchorElement.download = `${new Date().toISOString()}.csv`;

                document.body.appendChild(anchorElement);
                anchorElement.click();
                document.body.removeChild(anchorElement);
              }}
            >
              Download <LuDownload className="ml-2" />
            </Button>
          </div>
        )}

        <div className="order-1 w-fit items-end md:order-3 md:w-1/3">
          <div className="ml-auto flex w-fit items-center">
            {manualPagination ? (
              paginationChild
            ) : (
              <>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPreviousButton
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      />
                    </PaginationItem>
                    {table.getCanPreviousPage() && (
                      <PaginationItem>
                        <PaginationButton onClick={() => table.previousPage()}>
                          {table.getState().pagination.pageIndex}
                        </PaginationButton>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationButton isActive>
                        {table.getState().pagination.pageIndex + 1}
                      </PaginationButton>
                    </PaginationItem>
                    {table.getCanNextPage() && (
                      <PaginationItem>
                        <PaginationButton onClick={() => table.nextPage()}>
                          {table.getState().pagination.pageIndex + 2}
                        </PaginationButton>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationNextButton
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
