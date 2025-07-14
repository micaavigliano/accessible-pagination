import React from 'react';
import { GrFormPrevious } from "react-icons/gr";
import { MdSkipPrevious, MdSkipNext, MdNavigateNext } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, nextPage, prevPage, goToPage }) => {
  const getPageNumbers = () => {
    const firstPage = 1;
    const lastPage = totalPages;

    const shouldShowLeftEllipsis = currentPage > 4;
    const shouldShowRightEllipsis = currentPage < totalPages - 3;

    const pagesAroundCurrent = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
      .filter(page => page > firstPage && page < lastPage);

    const pageNumbers = [
      firstPage,
      shouldShowLeftEllipsis ? 'left-ellipsis' : null,
      ...pagesAroundCurrent,
      shouldShowRightEllipsis ? 'right-ellipsis' : null,
      lastPage
    ];

    return pageNumbers.filter(Boolean);
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="p-6 flex flex-col items-center" aria-label="Pagination">
      <div className='flex flex-row gap-3 max-[430px]:gap-1'>
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          aria-label="Go to the first item"
        >
          <MdSkipPrevious />
        </button>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          aria-label={`go back to the item number ${currentPage - 1}`}
        >
          <GrFormPrevious className='' />
        </button>
        <ol className='flex gap-3'>
          {pageNumbers.map((number) => {
            if (number === 'left-ellipsis' || number === 'right-ellipsis') {
              return (
                <li aria-label="Ellipsis, more pages between" key={number} className='relative top-5'>
                  <span aria-hidden="true">
                    ...
                  </span>
                </li>
              );
            }
            return (
              <li aria-setsize={totalPages} aria-posinset={typeof number === 'number' ? number : undefined} key={`page-${number}`}>
                <button
                  onClick={() => goToPage(Number(number))}
                  className={currentPage === Number(number) ? 'underline underline-offset-3 border-zinc-300' : ''}
                  aria-label={`go to page ${number}`}
                  aria-current={currentPage === Number(number) && 'page'}
                >
                  {number}
                </button>
              </li>
            );
          })}
        </ol>
        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          aria-label={`go to the item number ${currentPage + 1}`}
        >
          <MdNavigateNext />
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          className='text-neutral-950 dark:text-neutral-300'
          disabled={currentPage === totalPages}
          aria-label="go to the last item"
        >
          <MdSkipNext />
        </button>
      </div>
      <p>
        Page {currentPage} of {totalPages}
      </p>
    </nav>
  );
};

export default Pagination;