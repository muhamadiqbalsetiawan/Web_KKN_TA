import SidebarAdmin from "@/components/sidebarAdmin";
import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import Head from "next/head";
import ReactPaginate from 'react-paginate';

export default function Logbook() {
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [], error } = useSWR(
    "/api/admin/mahasiswa/logbookQuery",
    fetcher
  );

  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "Gray",
    onClick: () => setActive(index),
  });

  const router = useRouter();
  const [username, setUsername] = useState(null);
  let displayAdmin = "";

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      router.push("/admin");
    }
    setUsername(username);
  }, [router]);

  const [active, setActive] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tables.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem = Array.isArray(tables)
    ? tables.slice(indexOfFirstItem, indexOfLastItem)
    : [];
    const searchFilter = (item) => {
      const { kelompok, jenis, dosen, lokasi } = item;
      const searchText = searchTerm.toLowerCase();
  
      return (
        (kelompok && kelompok.toLowerCase().includes(searchText)) ||
        (jenis && jenis.toLowerCase().includes(searchText)) ||
        (dosen && dosen.toLowerCase().includes(searchText)) ||
        (lokasi && lokasi.toLowerCase().includes(searchText))
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


  if (error) {
    return <div>Error loading group details</div>;
  }

  if (!tables) {
    return <div>Loading... Data Error</div>;
  }

  if (username === null) {
    displayAdmin = "";
  } else {
    displayAdmin = (
      <>
        <SidebarAdmin />

        <div className="bg-primaryColor h-72 md:w-full -z-20">
          <div className="absolute ml-32 px-6 md:px-0 md:top-8 md:left-36 md:ml-32 sm:ml-0 font-bold text-2xl md:text-5xl text-white">
            <h1>Logbook Mahasiswa</h1>
          </div>
        </div>

        <div class="absolute ml-32 px-3 md:left-32 md:right-12  md:top-24 pb-5 rounded-xl bg-gray-50 shadow-lg">
          <div className="flex justify-between">
            <div className="static">
              <div className="relative mt-6">
                <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    class="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
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
            </div>
          </div>

          <div className=" mt-4 bg-white overflow-x-auto">
            <table className=" text-lg text-gray-500 min-w-full">
              <thead className=" text-white uppercase bg-gray-500 text-left">
                <tr className="">
                  <th scope="col" className="py-2 px-4">
                    No
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Kelompok
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Jenis KKN
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Dosen Pembimbing
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Lokasi KKN
                  </th>
                  <th scope="col" className="py-2 px-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-left">
              {currentPageItems.map((table, i) => (
                    <tr key={i}>
                      <td scope="col" className="py-2 px-4">
                        {i + 1}
                      </td>
                      <td scope="col" className="py-2 px-4">
                        {table.kelompok}
                      </td>
                      <td scope="col" className="py-2 px-4">
                        {table.jenis}
                      </td>
                      <td scope="col" className="py-2 px-4">
                        {table.dosen}
                      </td>
                      <td scope="col" className="py-2 px-4">
                        {table.lokasi}
                      </td>
                      <td scope="col" className="py-2 px-4">
                        <button>
                          <Link
                            href={`/admin/mahasiswa/detailLogbook/${table.id}`}
                          >
                            <span className="font-medium text-blue-400 hover:underline">
                              detail
                            </span>
                          </Link>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div type="pagination" className="flex justify-center gap-4 mt-2 ">
          <ReactPaginate
                  previousLabel={'<'}
                  nextLabel={'>'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={totalPages || 0}
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
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin | Mahasiswa - Logbook</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      {displayAdmin}
    </>
  );
}
