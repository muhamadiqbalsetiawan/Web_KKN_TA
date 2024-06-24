import SidebarAdmin from "@/components/sidebarAdmin";
import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import Head from "next/head";
import ReactPaginate from 'react-paginate';


export default function Laporan() {
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [], error } = useSWR(
    "/api/admin/dosen/kelompokQuery",
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
  const totalPages = tables ? Math.ceil(tables.length / itemsPerPage) : 0;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItem = Array.isArray(tables)
    ? tables.slice(indexOfFirstItem, indexOfLastItem)
    : [];


    const searchFilter = (item) => {
      const { nip, dosen_name, telpon_dosen, jenis_kelompok } = item;
      const searchText = searchTerm.toLowerCase();
  
      return (
        (nip &&
          typeof nip === "string" &&
          nip.toLowerCase().includes(searchText)) ||
        (dosen_name && dosen_name.toLowerCase().includes(searchText)) ||
        (telpon_dosen && telpon_dosen.toLowerCase().includes(searchText)) ||
        (jenis_kelompok && jenis_kelompok.toLowerCase().includes(searchText))
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
  
  // Fungsi untuk memotong data sesuai halaman aktif
  const displayData = () => {
    const filteredData = tables.filter(searchFilter);

    const startIndex = (active - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };


  if (username === null) {
    displayAdmin = "";
  } else {
    displayAdmin = (
      <>
        <SidebarAdmin />

        <div className="bg-primaryColor h-72 md:w-full -z-20">
          <div className="absolute ml-32 px-6 md:px-0 md:top-8 md:left-36 md:ml-32 sm:ml-0 font-bold text-2xl md:text-5xl text-white">
            <h1>Nilai Kelompok KKN</h1>
          </div>
        </div>

        <div className="absolute ml-32 px-3 md:left-32 md:right-12  md:top-24 pb-5 rounded-xl bg-gray-50 shadow-lg">
          <div className="flex justify-between">
            <div className="static">
              <div className="relative mt-6">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    ariaHidden="true"
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
            </div>
          </div>

          <div className="relative mt-4 bg-white overflow-x-auto">
            <table className=" text-lg text-gray-500 w-full">
              <thead className=" text-white bg-gray-500 text-center">
                <tr className="">
                  <th scope="col" className="py-2 px-2">
                    No
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Nama Dosen
                  </th>
                  <th scope="col" className="py-2 px-2">
                    NIP
                  </th>
                  <th scope="col" className="py-2 px-2">
                    No Telepon
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Kelompok
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Jenis
                  </th>
                  <th scope="col" className="py-2 px-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                  {currentPageItems.map((table, i) => (
                    <tr key={i}>
                      <td scope="col" className="py-1 px-2">
                        {i + 1}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.dosen_name}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.nip}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.telpon_dosen || "-"}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {"Kelompok " + table.kelompok_ids}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        {table.jenis_kelompok}
                      </td>
                      <td scope="col" className="py-1 px-2">
                        <button>
                          <Link href={`/admin/dosen/detailNilai/${table.nip}`}>
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
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin | Dosen - Nilai</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      {displayAdmin}
    </>
  );
}
