import React, { type FunctionComponent } from "react";

import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNextButton,
  PaginationPreviousButton,
} from "~/components/ui/pagination";

interface Props {
  currPageNo: number;
  handleFetchPreviousPage: () => void;
  handleFetchNextPage: () => void;
  disablePreviousButton?: boolean;
  disableNextButton?: boolean;
  isFetchingPreviousPage?: boolean;
  isFetchingNextPage?: boolean;
}

const PaginationControls: FunctionComponent<Props> = ({
  currPageNo,
  handleFetchPreviousPage,
  handleFetchNextPage,
  disablePreviousButton = false,
  disableNextButton = false,
  isFetchingPreviousPage = false,
  isFetchingNextPage = false,
}) => {
  return (
    <>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPreviousButton
              onClick={handleFetchPreviousPage}
              disabled={disablePreviousButton}
            />
          </PaginationItem>
          {!disablePreviousButton && !isFetchingPreviousPage && (
            <PaginationItem>
              <PaginationButton onClick={handleFetchPreviousPage}>
                {currPageNo}
              </PaginationButton>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationButton isActive>{currPageNo + 1}</PaginationButton>
          </PaginationItem>
          {!disableNextButton && !isFetchingNextPage && (
            <PaginationItem>
              <PaginationButton onClick={handleFetchNextPage}>
                {currPageNo + 2}
              </PaginationButton>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNextButton
              onClick={handleFetchNextPage}
              disabled={disableNextButton}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default PaginationControls;
