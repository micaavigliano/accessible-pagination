import { useEffect, useState } from "react";
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


function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;
  const { data, loading } = useFetch<AsteroidData>(
    `https://api.nasa.gov/neo/rest/v1/neo/browse?&api_key=${import.meta.env.VITE_NASA_API_KEY}&page=${currentPage}&size=${pageSize}`,
    currentPage - 1,
    20
  );
  const totalPages = data?.page.total_pages || 0

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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
      return new Date(current.close_approach_date) < new Date()
          ? current
          : latest;
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

  const dataReduced = reducedData(data!)

  return (
    <main>
      <h1 className="text-3xl font-bold underline">Asteroid app</h1>
      <section className="min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-center m-auto" aria-live="assertive" role="status">Loading...</p>
          </div>
        ) : (
          <div className="grid max-[430px]:grid-cols-1 grid-cols-2 gap-7 place-items-center">
            <p className="sr-only">There are {reducedData.length} items</p>
            {dataReduced.map((asteroid) => (
              <div key={asteroid.id} className="h-full border border-gray-300 rounded-lg p-4">
                <p><strong>Name: </strong>{asteroid.name}</p>
                <p><strong>Diameter: </strong>{asteroid.diameter}</p>
                <p><strong>Last time seen: </strong>{asteroid.lastTimeSeen}</p>
                <a href={asteroid.link} target="_black" aria-label={`to read more about ${asteroid.name} you can click here`}>Read more</a>
              </div>
            ))}
          </div>
        )}
      </section>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        nextPage={nextPage}
        prevPage={prevPage}
        goToPage={handlePageChange}
      />
    </main>
  )
}

export default App
