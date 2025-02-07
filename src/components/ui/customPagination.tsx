import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'; // Import ShadCN Pagination components
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage, setLimit } from '@/redux/reducers/bookSlice';
import { RootState, AppDispatch } from '@/redux/store';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
}
const LIMIT_OPTIONS = [10, 15, 25, 50, 100];

const CustomPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  limit,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  // handling limit value
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    dispatch(setLimit(newLimit));
    dispatch(setCurrentPage(1)); // Reset to page 1 when changing limit
  };

  return (
    <Pagination>
      <PaginationContent
      // className="absolute bottom-5"
      >
        {/* Limit Selector */}
        <div>
          <label className="mr-2">Show</label>
          <select
            value={limit}
            onChange={handleLimitChange}
            className="p-2 border rounded"
          >
            {LIMIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="ml-2">per page</span>
        </div>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              if (currentPage === 1) {
                e.preventDefault(); // Prevent clicking if already on the first page
              } else {
                handlePageChange(currentPage - 1);
              }
            }}
            className="bg-zinc-50  dark:bg-slate-800 dark:border-0"
          />
        </PaginationItem>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(Math.max(0, currentPage - 3), currentPage + 2)
          .map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                href="#"
                className={
                  page === currentPage ? 'text-green-500 font-bold' : ''
                }
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

        {/* Ellipsis */}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              if (currentPage === totalPages) {
                e.preventDefault(); // Prevent clicking if already on the last page
              } else {
                handlePageChange(currentPage + 1);
              }
            }}
            className=""
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
