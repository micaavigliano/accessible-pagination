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
  const [isSmallViewport, setIsSmallViewport] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsSmallViewport(e.matches);
    onChange(mql);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const getPageNumbers = () => {
    const firstPage = 1;
    const lastPage = totalPages;
    const range = isSmallViewport ? 1 : 2;

    const shouldShowLeftEllipsis = currentPage > range + 2;
    const shouldShowRightEllipsis = currentPage < totalPages - (range + 1);

    const pagesAroundCurrent = Array.from(
      { length: range * 2 + 1 },
      (_, i) => currentPage - range + i
    ).filter(page => page > firstPage && page < lastPage);

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
    <nav className="p-2 sm:p-6 flex flex-col items-center w-full max-w-full overflow-hidden box-border" aria-label="Pagination">
      <div className='flex flex-row flex-nowrap justify-between items-center w-full'>
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className="min-w-[32px] min-h-[44px] sm:min-w-[44px] flex items-center justify-center p-0.5 sm:p-2"
          aria-label="Go to the first item"
        >
          <MdSkipPrevious aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="min-w-[32px] min-h-[44px] sm:min-w-[44px] flex items-center justify-center p-0.5 sm:p-2"
          aria-label={`go back to the item number ${currentPage - 1}`}
        >
          <GrFormPrevious aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <ol className='flex items-center gap-0.5 sm:gap-3'>
          {pageNumbers.map((number) => {
            if (number === 'left-ellipsis' || number === 'right-ellipsis') {
              return (
                <li aria-label="Ellipsis, more pages between" key={number} className='flex items-center px-1'>
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
                  className={`min-w-[32px] min-h-[44px] sm:min-w-[44px] flex items-center justify-center p-0.5 sm:p-2 text-sm sm:text-base ${currentPage === Number(number) ? 'underline underline-offset-3 border-zinc-300' : ''}`}
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
          className="min-w-[32px] min-h-[44px] sm:min-w-[44px] flex items-center justify-center p-0.5 sm:p-2"
          aria-label={`go to the item number ${currentPage + 1}`}
        >
          <MdNavigateNext aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          className='min-w-[32px] min-h-[44px] sm:min-w-[44px] flex items-center justify-center p-0.5 sm:p-2 text-neutral-950 dark:text-neutral-300'
          disabled={currentPage === totalPages}
          aria-label="go to the last item"
        >
          <MdSkipNext aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
      <p className="text-sm sm:text-base mt-2">
        Page {currentPage} of {totalPages}
      </p>
    </nav>
  );
};

export default Pagination;