import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import Link from 'next/link';
import { IoChevronBackOutline } from "react-icons/io5";
import useSWR from "swr";


export default function DetailLaporan() {

  const router = useRouter();
  const { id } = router.query; // Mengakses nilai dari query parameter 'id'

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data : data = [], error } = useSWR(id? `/api/dosen/laporanDetail?id=${id}`:null, fetcher);
  const { data : data2 = [], error2 } = useSWR(id?`/api/dosen/laporanDetailkelompok?id=${id}`:null, fetcher);

  if (error || error2 ) {
    return <div>Error loading group details</div>;
  }

  if (!data || !data2 ) {
    return <div>{data === null ? 'No data available' : 'Loading...'}</div>;
  }

  const handleDownload = async (laporan) => {
    try {
      const downloadUrl = `/api/download?laporan=${encodeURIComponent(laporan)}`;
      console.log('Download URL:', downloadUrl);
  
      const response = await fetch(downloadUrl);
      console.log('Fetch Response:', response);
  
      if (response.ok) {
        const link = document.createElement('a');
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
        <title>Detail Laporan</title>
        <meta property="og:title" content="Dashboard" key="title" />
      </Head>

      <div className="flex flex-row bg-primaryColor justify-start">
        <div className="h-screen w-screen overflow-auto grow">
            <div className='absolute my-2 mx-4 md:my-6 md:mx-6 bg-white p-2 rounded-full drop-shadow-xl z-40'>
                <Link href='/dosen/laporan' className="text-xl"><IoChevronBackOutline /></Link>
            </div>
            {/* <Navbar /> */}
            <div className="mt-12 mb-6 ml-6 md:ml-10 md:mt-10 md:mb-4 font-bold text-3xl md:text-5xl text-white flex justify-center">
              <h1>Laporan Kelompok</h1>
            </div>
            {data.map((item) => (
            <div className="flex justify-center items-center" key={item.id}>
            <div className="p-3 mx-6 md:mt-4 md:mx-20 md:p-4 bg-white shadow-lg rounded-xl md:w-1/2">
                <h1 class="text-2xl md:text-2xl font-bold text-gray-900 flex justify-center items-center">
                    {item.kelompok}
                </h1>
                <h1 class="text-lg md:text-lg font-bold text-gray-900 flex justify-center items-center">
                    {item.jenis_kelompok}
                </h1>
                <div className="md:flex md:justify-center md:items-center">
                    <div class=" pb-2 text-left">
                        <div className="mb-2 text-sm font-semibold md:font-semibold md:text-lg">
                            <h3>Ketua : {item.ketua_name || "-"}</h3>
                            <h3>Kontak Ketua : {item.ketua_telpon || "-"}</h3>
                            <h3>Lokasi : {item.lokasi || "-"}</h3>
                            <h3>Anggota : </h3>
                        </div>
                        <div className=' mx-2 md:mx-4 md:w-auto'>
                            <div className='relative overflow-x-auto overflow-y-auto bg-white md:w-full max-h-80'>
                                <table className=' text-sm md:text-lg text-gray-500 min-w-full w-full text-left rtl:text-right '>
                                <thead className=' text-white bg-primaryColor text-left md:text-center'>
                                    <tr className=''>
                                    <th scope='col' className='py-2 px-4'>No</th>
                                    <th scope='col' className='py-2 px-4'>Judul Laporan</th>
                                    <th scope='col' className='py-2 px-4'>Nama</th>
                                    <th scope='col' className='py-2 px-4'>laporan</th>
                                    <th scope='col' className='py-2 px-4'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-left md:text-center'>
                                {data2.length > 0 && data2.map((items, i) => (
                                    <tr key={i}>
                                        <td scope='col' className='px-4'>{i + 1}</td>
                                        <td scope='col' className='px-4'>{items.judul}</td>
                                        <td scope='col' className='px-4'>{items.nama}</td>
                                        <td scope='col' className='px-4'>{items.laporan}</td>
                                        <td scope='col' className='px-4'>
                                            <div className='flex justify-between space-x-2'>
                                                <button 
                                                className='font-medium text-blue-400 hover:underline'
                                                onClick={() => handleDownload(items.laporan)}
                                                >
                                                    Download
                                                </button>
                                                <button 
                                                className='font-medium text-blue-400 hover:underline'
                                                onClick={() => handleView(items.laporan)}
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
                </div>
            </div>
            </div>
            ))}
        </div>
      </div>
    </>
  );
}
