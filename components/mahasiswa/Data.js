import { useState } from 'react';
import useSWR from 'swr';

export function Data() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR('/api/mahasiswa/query', fetcher);

  // Items per page
  const itemsPerPage = 3;

  // State for current page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the starting and ending index for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Render loading state
  if (!data && !error) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  // Paginate the data
  const paginatedData = data.slice(startIndex, endIndex);

  // Render data
  return (
    <div className="read">
      {paginatedData.map((item) => (
        <div key={item.mhs_nim} className="mhs">
          <span>ID Mahasiswa </span>: {item.mhs_nim} <br />
          <span>Nama Mahasiswa</span>: {item.mhs_nama}
        </div>
      ))}
      <Pagination
        currentPage={currentPage}
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

// Pagination component
function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate an array of page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={currentPage === page ? 'active' : ''}
        >
          {page}
        </button>
      ))}
      {currentPage < totalPages && (
        <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
      )}
    </div>
  );
}
