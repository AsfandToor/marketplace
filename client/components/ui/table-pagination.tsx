import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

interface TablePaginationProps {
    count: number
    page: number
    limit: number
    onPageChange: (page: number) => void
    hasNextPage: boolean
    hasPrevPage: boolean
}

const TablePagination = ({
    count,
    page,
    limit,
    onPageChange,
    hasNextPage,
    hasPrevPage,
}: TablePaginationProps) => {
  const totalPages = Math.ceil(count / limit);

  return (
    <Pagination className="mt-5 cursor-pointer">
      <PaginationContent>
        {hasPrevPage && (
          <PaginationPrevious onClick={() => onPageChange(page - 1)}>
            Previous
          </PaginationPrevious>
        )}

        {Array.from({ length: totalPages }, (_, index) => {
          const currentPage = index + 1;
          return (
            <PaginationItem key={currentPage}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => onPageChange(currentPage)}
              >
                {currentPage}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {hasNextPage && (
          <PaginationNext onClick={() => onPageChange(page + 1)}>
            Next
          </PaginationNext>
        )}
      </PaginationContent>
    </Pagination>
  )
}
export default TablePagination