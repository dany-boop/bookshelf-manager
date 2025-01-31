import Link from 'next/link';
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
import { setCurrentPage } from '@/store/reducers/bookSlice';
import { RootState, AppDispatch } from '@/store/store';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const CustomPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              if (currentPage === 1) {
                e.preventDefault(); // Prevent clicking if already on the first page
              } else {
                handlePageChange(currentPage - 1);
              }
            }}
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
                  page === currentPage ? 'text-blue-600 font-bold' : ''
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
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
