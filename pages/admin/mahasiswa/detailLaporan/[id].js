import { useRouter } from "next/router";
import Link from "next/link";
import { IoChevronBackOutline } from "react-icons/io5";
import useSWR from "swr";
import { useState } from "react";
import Head from "next/head";

export default function DetailLaporan() {
  const router = useRouter();
  const { id } = router.query; // Mengakses nilai dari query parameter 'id'
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [], error } = useSWR(
    id ? `/api/admin/mahasiswa/laporanDetail?id=${id}` : null,
    fetcher
  );
  const { data: tables2 = [], error2 } = useSWR(
    id ? `/api/admin/mahasiswa/laporanDetailkelompok?id=${id}` : null,
    fetcher
  );

  const handleDownload = async (laporan) => {
    try {
      const downloadUrl = `/api/download?laporan=${encodeURIComponent(
        laporan
      )}`;
      console.log("Download URL:", downloadUrl);

      const response = await fetch(downloadUrl);
      console.log("Fetch Response:", response);

      if (response.ok) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = laporan;  
        document.body.appendChild(link);

        link.click();
      } else {
        console.error("Error downloading file:", response.statusText);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  
  const handleView = async (laporan) => {
    try {
      const response = await fetch(`/api/view?laporan=${encodeURIComponent(laporan)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf'
        }
      });
  
      if (!response.ok) {
        throw new Error('Gagal memuat file PDF');
      }
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
    <Head>
        <title>Admin | Laporan Kelompok {id}</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      <div className="absolute bg-primaryColor h-screen w-screen">
        <div className="absolute mt-4 ml-2 bg-white p-2 rounded-full drop-shadow-xl">
          <Link href="/admin/mahasiswa/laporan" className="text-xl">
            <IoChevronBackOutline />
          </Link>
        </div>
        <h1 className="flex justify-center text-white text-4xl font-bold mt-8">
          Detail Laporan Mahasiswa
        </h1>
        <div class="absolute px-5 md:left-24 md:right-24 md:top-24 bg-gray-50 shadow-lg rounded-xl flex justify-center space-x-8 h-auto w-auto">
          {tables2.map((items) => (
            <div
              className="bg-white h-full w-1/3 grid justify-center items-center rounded-lg py-3 px-3 my-8"
              key={items.id}
            >
              <div className="font-bold text-3xl flex items-center justify-center my-4">
                <picture>
                  <img
                    src="/nav-logo2.png"
                    alt="Logo UIN"
                    className="md:w-[90px]"
                  />
                </picture>
              </div>
              <div>
                <h1 className="font-bold text-4xl flex items-center justify-center mb-3 text-center">
                  {items.kelompok || "-"}
                </h1>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    Jenis KKN
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    {items.jenis || "-"}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    Lokasi KKN
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    {items.lokasi || "-"}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    Dosen Pembimbing:
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    {items.nama || "-"}
                  </p>
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    No Telepon:
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    {items.telpon_dosen || "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}
          ;
          <div className="flex justify-center items-center w-2/3 rounded-lg">
            <table className="bg-white text-lg text-gray-500  text-center w-full h-auto ">
              <thead className=" text-white  bg-gray-500 text-center">
                <tr className="">
                  <th scope="col" className="py-4 px-2">
                    No
                  </th>
                  <th scope="col" className="py-4 px-2">
                    Judul Laporan
                  </th>
                  <th scope="col" className="py-4 px-2">
                    File
                  </th>
                  <th scope="col" className="py-4 px-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {tables.length > 0 &&
                  tables.map((item, i) => (
                    <tr key={i}>
                      <td scope="col" className="py-2 px-2">
                        {i + 1}
                      </td>
                      <td scope="col" className="py-2 px-2">
                        {item.judul}
                      </td>
                      <td scope="col" className="py-2 px-2">
                        {item.laporan}
                      </td>
                      <td scope="col" className="py-2 px-2">
                        <div className="felx justify-between space-x-2">
                          <button
                            className="font-medium text-blue-400  hover:underline"
                            onClick={() => handleDownload(item.laporan)}
                          >
                            Download
                          </button>
                          <button
                            className="font-medium text-blue-400 hover:underline"
                            onClick={() => handleView(item.laporan)}
                            >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
