import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'; // Import ShadCN Pagination components
import { useDispatch } from 'react-redux';
import { setCurrentPage, setLimit } from '@/redux/reducers/bookSlice';
import { AppDispatch } from '@/redux/store';
import { Select, SelectTrigger, SelectContent, SelectItem } from './select';

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
  const handleLimitChange = (newValue: string) => {
    const newLimit = parseInt(newValue, 10);
    dispatch(setLimit(newLimit));
    dispatch(setCurrentPage(1));
  };

  return (
    <Pagination>
      <PaginationContent>
        <div className="flex items-center ">
          <label className="mr-2">Show</label>

          <Select value={String(limit)} onValueChange={handleLimitChange}>
            <SelectTrigger>{limit}</SelectTrigger>
            <SelectContent>
              {LIMIT_OPTIONS.map((opt) => (
                <SelectItem value={String(opt)} key={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              if (currentPage === 1) {
                e.preventDefault();
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
