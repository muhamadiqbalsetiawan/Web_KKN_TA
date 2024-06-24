import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import useSWR from "swr";
import ReactPaginate from 'react-paginate';


export default function LogbookKKN() {

  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const { id } = router.query; // Mengakses nilai dari query parameter 'id'

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data : tables = [], error } = useSWR(id? `/api/dosen/logbookDetail?id=${id}`:null, fetcher);
  const { data : data2 = [], error2 } = useSWR(id?`/api/dosen/logbookDetailkelompok?id=${id}`:null, fetcher);

  const [active, setActive] = useState(1);
  const itemsPerPage = 10;
  const totalPages = tables ? Math.ceil(tables.length / itemsPerPage) : 0;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem = Array.isArray(tables)
    ? tables.slice(indexOfFirstItem, indexOfLastItem)
    : [];


    const searchFilter = (item) => {
      const {
        hari,
        lokasi,
        target,
        link,
        mahasiswa,
      } = item;
  
      const searchText = searchTerm.toLowerCase();
  
      return (
        (hari && hari.toLowerCase().includes(searchText))  ||
        (lokasi && lokasi.toLowerCase().includes(searchText))  ||
        (target && target.toLowerCase().includes(searchText)) ||
        (link && link.toLowerCase().includes(searchText)) ||
        (mahasiswa && mahasiswa.toLowerCase().includes(searchText)) 
      );
    };

  useEffect(() => {
    const filtered = Array.isArray(tables) ? tables.filter(searchFilter) : [];
    setFilteredItems(filtered);
    setCurrentPage(0); // Reset currentPage ketika searchTerm berubah
  }, [searchTerm, tables]);

  // Mendapatkan data untuk halaman saat ini
  const offset = currentPage * itemsPerPage;
  const currentPageItems = filteredItems.slice(offset, offset + itemsPerPage);

  // Fungsi untuk mengatur halaman saat tombol pagination di-klik
  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };
  
  const filteredItem = currentItem.filter(searchFilter);
  
  // Mendapatkan data untuk halaman saat ini

  // Fungsi untuk memotong data sesuai halaman aktif
  const displayData = () => {
    const filteredData = tables.filter(searchFilter);

    const startIndex = (active - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };


if (error || error2 ) {
  return <div>Error loading group details</div>;
}

if (!tables || !data2 ) {
  return <div>{tables === null ? 'No data available' : 'Loading...'}</div>;
}

  return (
    <>
      <div className="absolute bg-primaryColor w-full h-72 -z-20"></div>
      <div className="flex flex-row justify-start">
        <div className="overflow-auto h-screen grow">
            <div className='absolute my-2 mx-4 md:my-4 md:mx-6 bg-white p-2 rounded-full drop-shadow-xl z-40'>
                <Link href='/dosen/logbook' className="text-xl"><IoChevronBackOutline /></Link>
            </div>
          <div className="px-6 pb-5 w-auto">
            <div className="mt-8 text-center mb-5 md:mt-8 md:mb-10 font-bold text-2xl md:text-5xl text-white">
              <h1 className="md:text-center">Logbook KKN</h1>
            </div>
            <div className="p-3 md:p-6 bg-white shadow-lg rounded-xl">
            {data2.map((items) => (
              <div className="mt-3 ml-4 md:ml-5 flex flex-row justify-center items-center md:flex md:justify-center md:items-center" key={items.id}>
                <div className="box-border mb-3">
                  <h1 className="text-lg md:text-3xl font-bold grid justify-center md:grid md:justify-center md:items-center">{items.jenis}</h1>
                  <h2 className="md:text-xl font-semibold grid justify-center items-center md:grid md:justify-center md:items-center">{items.kelompok}</h2>
                </div> 
              </div>
              ))}
              
              <div className="relative mt-3">
                  <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="table-search"
                    className='block pt-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50  "'
                    placeholder="Search for items"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              <div className="box-border md:py-3 md:px-2 mb-3 lg:text-base text-xs md:text-sm overflow-x-auto rounded-lg font-medium">
                <table className="w-full rounded-xl bg-white">
                  <thead className="bg-primaryColor text-white">
                    <tr className="">
                      <th className="rounded-tl-lg p-1 lg:p-4">No</th>
                      <th className="px-6 p-2 lg:p-4">Hari, Tanggal</th>
                      <th className="px-6 p-2 lg:p-4">Nama</th>
                      <th className="px-6 p-2 lg:p-4">Lokasi</th>
                      <th className="px-6 p-3 lg:p-4">Kegiatan</th>
                      <th className="px-6 p-3 lg:p-4">Target</th>
                      <th className="px-6 p-3 lg:p-4">Link</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                  {currentPageItems.map((item, i) => (
                      <tr key={i} className="border-y border-slate-300">
                        <td className="py-1 px-0 lg:p-3">{i + 1}</td>
                        <td className="py-1 px-1 lg:p-3">{item.hari}</td>
                        <td className="py-1 px-1 lg:p-3">{item.mahasiswa}</td>
                        <td className="py-1 px-2 lg:p-3">{item.lokasi}</td>
                        <td className="py-1 px-2 lg:p-3">{item.kegiatan}</td>
                        <td className="py-1 px-2 lg:p-3">{item.target}</td>
                        <td className="py-1 px-2 lg:p-3 text-blue-500 hover:text-blue-800 hover:underline"> <Link href={item.link} target="_blank"> {item.link} </Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-4">
                  <nav className="block">
                    <ul className="flex pl-0 rounded list-none flex-wrap">
                    <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination flex justify-center mt-8'}
                        activeClassName={'bg-blue-500 text-white px-3 py-1 rounded-md'}
                        previousClassName={'px-3 py-1 rounded-md border border-gray-300 mr-2'}
                        nextClassName={'px-3 py-1 rounded-md border border-gray-300 ml-2'}
                        pageClassName={'px-3 py-1 rounded-md border border-gray-300 mr-2 hover:bg-gray-200'}
                        disabledClassName={'text-gray-400 cursor-not-allowed'}
                      />
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
