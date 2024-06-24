// components/AnggotakknList.js
import React, { useState } from 'react';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function AnggotakknList() {
  const { data: anggotakknData, error, mutate } = useSWR('/api/testing/apianggotakkn', fetcher);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Apply search filter to data
  const filteredData = anggotakknData
    ? anggotakknData.filter(
        (item) =>
          item.mahasiswa_nim.toString().includes(searchTerm) ||
          item.mahasiswa_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.jeniskkn.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (!filteredData) {
      return [];
    }

    const array = [...filteredData];
    if (sortConfig.direction === 'ascending') {
      return array.sort((a, b) => (a[sortConfig.key] > b[sortConfig.key] ? 1 : -1));
    }
    if (sortConfig.direction === 'descending') {
      return array.sort((a, b) => (a[sortConfig.key] < b[sortConfig.key] ? 1 : -1));
    }
    return array;
  };

  const resetSort = () => setSortConfig({ key: null, direction: 'default' });

  const handleEdit = async (id) => {
    // Implement your edit logic here
    const newJenisKKN = prompt('Masukan Jenis KKN baru:');
    if (newJenisKKN !== null) {
      await fetch(`/api/testing/admin/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newJenisKKN }),
      });
      // Refresh data after editing
      mutate();
    }
  };

  const handleDelete = async (id) => {
    // Implement your delete logic here
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      await fetch(`/api/testing/delete/${id}`, {
        method: 'DELETE',
      });
      // Refresh data after deletion
      mutate();
    }
  };

  if (error) {
    console.error('Error fetching data:', error);
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <h1>Anggotakkn List</h1>
      <button onClick={resetSort}>Reset Sort</button>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('mahasiswa_nim')}>NIM</th>
            <th onClick={() => handleSort('mahasiswa_nama')}>Nama</th>
            <th onClick={() => handleSort('jeniskkn')}>Jenis KKN</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedData() &&
            sortedData().map((item) => (
              <tr key={item.id_anggotakkn}>
                <td>{item.mahasiswa_nim}</td>
                <td>{item.mahasiswa_nama}</td>
                <td>{item.jeniskkn}</td>
                <td>
                  <button onClick={() => handleEdit(item.id_anggotakkn)}>Edit</button>
                  <button onClick={() => handleDelete(item.id_anggotakkn)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredData.length || 0}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}

// Pagination component (unchanged)
function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className={number === currentPage ? 'active' : ''}>
            <button onClick={() => paginate(number)}>{number}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
