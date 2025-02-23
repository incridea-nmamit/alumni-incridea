"use client";

import React, { useState } from 'react';
import { DataTable } from "~/components/ui/data-table";
import PaginationControls from "~/components/utils/pagination/controls";
import { VerifierColumns } from "./columns";
import { api } from "~/trpc/react";


const VERIFIER = () => {
  const { data, fetchNextPage, isFetchingPreviousPage, isFetchingNextPage } =
    api.verifier.getAllUsersFiltered.useInfiniteQuery(
      { take: 50 },
      { 
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const [pageNo, setPageNo] = useState<number>(0);

  const handleFetchNextPage = async () => {
    await fetchNextPage();
    setPageNo((prev) => prev + 1);
  };

  const handleFetchPreviousPage = () => {
    setPageNo((prev) => prev - 1);
  };

  const currPage = data?.pages?.[pageNo]?.users ?? [];
  const nextCursor = data?.pages[pageNo]?.nextCursor;

  return (
    <div className="container mx-auto py-10 mt-36">
      <DataTable
        columns={VerifierColumns}
        data={currPage}
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
  );
};

export default VERIFIER;
