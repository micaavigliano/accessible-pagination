import { useEffect, useRef, useState } from "react";
import useFetch from "./customHook/useFetch";
import { Asteroid } from "./interface/Asteroid";
import Pagination from "./components/Pagination";

interface AsteroidData {
  near_earth_objects: Asteroid[];
  page: {
    total_elements: number;
    total_pages: number;
    number: number;
  };
}[]

const readPageFromUrl = (): number => {
  const params = new URLSearchParams(window.location.search);
  const parsed = parseInt(params.get('page') ?? '1', 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
};

const buildPageUrl = (page: number): string => {
  const params = new URLSearchParams(window.location.search);
  if (page <= 1) {
    params.delete('page');
  } else {
    params.set('page', String(page));
  }
  const query = params.toString();
  return `${window.location.pathname}${query ? '?' + query : ''}`;
};

function App() {
  const [currentPage, setCurrentPage] = useState<number>(() => readPageFromUrl());
  const pageSize = 20;
  const { data, loading } = useFetch<AsteroidData>(
    `https://api.nasa.gov/neo/rest/v1/neo/browse?&api_key=${import.meta.env.VITE_NASA_API_KEY}&page=${currentPage}&size=${pageSize}`,
    currentPage - 1,
    20
  );
  const totalPages = data?.page.total_pages || 0;

  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPage(readPageFromUrl());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const desired = buildPageUrl(currentPage);
    if (window.location.pathname + window.location.search !== desired) {
      window.history.pushState(null, '', desired);
    }
  }, [currentPage]);

  useEffect(() => {
    if (loading || isInitialLoad.current) {
      if (!loading) isInitialLoad.current = false;
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'instant' : 'smooth' });

    // Screen reader: focus hidden heading for page context announcement
    const heading = resultsHeadingRef.current;
    if (heading) {
      heading.textContent = `Page ${currentPage} — Showing ${data?.near_earth_objects.length || 0} items`;
      heading.focus({ preventScroll: true });
    }

    // Keyboard: move focus to first interactive element so :focus-visible is visible
    requestAnimationFrame(() => {
      const firstInteractive = document.querySelector<HTMLElement>(
        '[data-results] a, [data-results] button, [data-results] input'
      );
      if (firstInteractive) {
        firstInteractive.focus({ preventScroll: true });
      }
    });
  }, [currentPage, loading, data]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const reducedData = (data: AsteroidData) => {
    return data?.near_earth_objects.map((asteroid: Asteroid) => {
      const lastApproach = asteroid.close_approach_data.reduce((latest, current) => {
        return new Date(current.close_approach_date) < new Date() ? current : latest;
      }, asteroid.close_approach_data[0]);

      return {
        name: asteroid.name,
        diameter: asteroid.estimated_diameter.meters.estimated_diameter_max,
        lastTimeSeen: lastApproach ? lastApproach.close_approach_date : 'Unknown',
        id: asteroid.id,
        link: asteroid.nasa_jpl_url,
        magnitude: asteroid.absolute_magnitude_h,
        minifyName: asteroid.name
      }
    });
  }

  const dataReduced = reducedData(data!);

  return (
    <main>
      <h1 className="text-2xl sm:text-3xl font-bold underline p-4 sm:p-5">Asteroid app</h1>
      <section className="min-h-[300px]" aria-label="List of near earth objects">
        <h2 ref={resultsHeadingRef} tabIndex={-1} className="sr-only">
          Near-Earth objects
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-full" aria-live="polite" role="status">
            <p className="text-center m-auto">Loading...</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-7 px-4 sm:px-6 place-items-center"
            data-results
          >
            <ul className="contents">
              {dataReduced.map((asteroid) => (
                <li key={asteroid.id}>
                  <article
                    aria-labelledby={`asteroid-${asteroid.id}`}
                    className="h-full w-full sm:max-w-sm border border-gray-300 rounded-lg p-3 sm:p-4 text-sm sm:text-base break-words"
                  >
                    <h3 id={`asteroid-${asteroid.id}`}>{asteroid.name}</h3>
                    <p>
                      <strong>Diameter:</strong> {asteroid.diameter.toFixed(2)} meters
                    </p>
                    <p>
                      <strong>Last time seen:</strong> {asteroid.lastTimeSeen}
                    </p>
                    <a
                      href={asteroid.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View NASA details for ${asteroid.name}`}
                      className="text-blue-400"
                    >
                      View NASA details
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        nextPage={nextPage}
        prevPage={prevPage}
        goToPage={handlePageChange}
        loading={loading}
        hrefForPage={buildPageUrl}
      />
    </main >
  );
}

export default App;
