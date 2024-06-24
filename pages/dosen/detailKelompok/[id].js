import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import Link from 'next/link';
import { IoChevronBackOutline } from "react-icons/io5";
import useSWR from "swr";
import { useSession } from "next-auth/react";

export default function DetailKelompok() {
  const router = useRouter();
  const id = router.query;
  const { data: Session, status } = useSession();

  const id_nip = Session?.user?.username;

  const fetcher = (url) => fetch(url).then((res) => res.json());
  
  // First API (item)
  const { data : tables = [], firstApiError } = useSWR(id ? `/api/admin/dosen/kelompokQueryDetail?id=${id_nip}`: null, fetcher);

  // Second API call (item2)
  const { data : tablesList = [], thirdApiError } = useSWR(id ? `/api/admin/dosen/kelompokListQuery?id=${id_nip}`: null, fetcher);

  // Third API call (item3)
  const { data: mahasiswaData, error: secondApiError } = useSWR(
    id_nip && id_nip
      ? `/api/admin/dosen/kelompokMahasiswaQuery?id=${id_nip}&id${id_nip}`
      : null,
    fetcher
  );

  if (firstApiError || secondApiError || thirdApiError) {
    console.error('Error fetching data:', firstApiError || secondApiError);
    return <div>Error loading group details</div>;
  }

return (
  <>
    <Head>
      <title>Detail Kelompok</title>
      <meta property="og:title" content="Dashboard" key="title" />
    </Head>

    <div className="flex flex-row bg-primaryColor justify-start">
      <div className="h-screen w-screen overflow-auto grow">
          <div className='absolute my-2 mx-4 md:my-6 md:mx-6 bg-white p-2 rounded-full drop-shadow-xl z-40'>
              <Link href='/dosen/kelompok' className="text-xl"><IoChevronBackOutline /></Link>
          </div>
          {/* <Navbar /> */}
          <div className="mt-8 mb-2 ml-6 md:ml-10 md:mt-6 md:mb-10 font-bold text-2xl md:text-5xl text-white flex justify-center">
            <h1>Kelompok Binaan</h1>
          </div>
          <div className="md:flex md:justify-center md:items-center">
          {tablesList && tablesList.length > 0 ? (tablesList
              .filter((item2) => item2.kelompok_id === Number(router.query.id))
              .map((item2) => (
              <div className="p-3 md:py-4 md:px-8 mx-4  bg-white shadow-lg rounded-xl md:w-auto" key={item2.kelompok_id}>                  
                <h1 class="text-2xl font-bold text-gray-900 flex justify-center items-center">
                    {item2.kelompok_name} <br/>
                </h1>
                <h1 class="text-lg font-bold text-gray-900 flex justify-center items-center">
                    {item2.jenis_kelompok}
                </h1>
                  <div className=" pb-2 text-left">
                      <div className="mb-2 text-sm font-semibold md:text-lg md:font-semibold">
                          <h3>Ketua : {item2.ketua_name || "-"}</h3>
                          <h3>Kontak Ketua : {item2.ketua_telpon || "-"}</h3>
                          <h3>Lokasi : {item2.lokasi || "-"}</h3>
                          <h3>Anggota :</h3>
                      </div>
                      <div className='md:mx-9 md:w-auto'>
                          <div className='relative overflow-x-auto overflow-y-auto bg-white max-h-80'>
                              <table className=' text-sm md:text-lg text-gray-500 min-w-full w-full text-left rtl:text-right '>
                              <thead className=' text-white  bg-primaryColor text-left md:text-center'>
                                  <tr className=''>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2'>No</th>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2'>Nama</th>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2'>NIM</th>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2'>Jurusan</th>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2'>Fakultas</th>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2s'>No Telepon</th>
                                  </tr>
                              </thead>
                              <tbody className='text-left md:text-center'>
                              {mahasiswaData && mahasiswaData.length>0?(mahasiswaData
                                    .filter((item3) => item3.kelompok_name === item2.kelompok_name)
                                    .map((filteredItem, j) => (
                                      <tr key={filteredItem.nim}>
                                        <td scope='col' className='px-4'>{j + 1}</td>
                                        <td scope='col' className='px-4'>{filteredItem.mahasiswa_name}</td>
                                        <td scope='col' className='px-4'>{filteredItem.nim}</td>
                                        <td scope='col' className='px-4'>{filteredItem.mahasiswa_jurusan}</td>
                                        <td scope='col' className='px-4'>{filteredItem.mahasiswa_fakultas}</td>
                                        <td scope='col' className='px-4'>{filteredItem.mahasiswa_telpon}</td>
                                      </tr>
                                ))):(
                                    <tr>
                                        <td scope='col' className='px-4'>-</td>
                                        <td scope='col' className='px-4'>-</td>
                                        <td scope='col' className='px-4'>-</td>
                                        <td scope='col' className='px-4'>-</td>
                                        <td scope='col' className='px-4'>-</td>
                                        <td scope='col' className='px-4'>-</td>
                                      </tr>
                                )}
                              </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
          ))):(
            <div className="p-3 md:py-4 md:px-8 mx-4  bg-white shadow-lg rounded-xl md:w-auto">
                
                <h1 class="text-xl font-bold text-gray-900 flex justify-center items-center">
                    -
                </h1>
                  <div class=" pb-2 text-left">
                      <div className="mb-2 text-sm font-semibold md:text-lg md:font-semibold">
                          <h3>Ketua : -</h3>
                          <h3>Kontak Ketua : -</h3>
                          <h3>Lokasi : -</h3>
                          <h3>Anggota : - </h3>
                      </div>
                      <div className='md:mx-9 md:w-auto'>
                          <div className='relative overflow-x-auto overflow-y-auto bg-white max-h-80'>
                              <table className=' text-sm md:text-lg text-gray-500 min-w-full w-full text-left rtl:text-right '>
                              <thead className=' text-white  bg-primaryColor text-left md:text-center'>
                                  <tr className=''>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2'>No</th>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2'>Nama</th>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2'>NIM</th>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2'>Jurusan</th>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2'>Fakultas</th>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2s'>No Telepon</th>
                                  </tr>
                              </thead>
                              <tbody className='text-left md:text-center'>
                                  <tr>
                                  <td scope='col' className='px-4'>-</td>
                                        <td scope='col' className='px-4'>-</td>
                                        <td scope='col' className='px-4'>-</td>
                                        <td scope='col' className='px-4'>-</td>
                                        <td scope='col' className='px-4'>-</td>
                                        <td scope='col' className='px-4'>-</td>
                                  </tr>
                              </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
          )}
          </div>
      </div>
    </div>
  </>
);
}
