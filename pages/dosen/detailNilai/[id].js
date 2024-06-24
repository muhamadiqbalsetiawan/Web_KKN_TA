import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import Link from 'next/link';
import { IoChevronBackOutline } from "react-icons/io5";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/admin/modal";
import useSWR from "swr";
import { useSession } from "next-auth/react";

export default function DetailKelompok() {
  const router = useRouter();
  const { data: Session, status } = useSession();

  const id = Session?.user?.username;

  const fetcher = (url) => fetch(url).then((res) => res.json());

  // First API (item)
  const { data : tables = [], firstApiError } = useSWR(id ? `/api/admin/dosen/kelompokQueryDetail?id=${id}`: null, fetcher);

  // Second API call (item2)
  const { data : tablesList = [], thirdApiError } = useSWR(id ? `/api/admin/dosen/kelompokListQuery?id=${id}`: null, fetcher);

  // Third API call (item3)
  const { data: mahasiswaData, error: secondApiError } = useSWR(
    id && id
      ? `/api/admin/dosen/kelompokMahasiswaQuery?id=${id}&id${id}`
      : null,
    fetcher
  );

  const [modalData, setModalData] = useState({
    isVisible: false,
    nim: null,
  });
  
  const { isVisible, nim } = modalData;
  
  const setShowModal = (isVisible, nim = null) => {
    setModalData({ isVisible, nim });
  };

  const [enteredNilai, setEnteredNilai] = useState('');

  const handleSimpan = async () => {
    try {
      const response = await fetch('/api/admin/dosen/nilaiEdit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nim: nim, // Assuming you have access to filteredItem here
          nilai: enteredNilai,
        }),
      });
  
      if (response.ok) {
        // Handle success
        window.location.reload();
        console.log('Nilai updated successfully');
      } else {
        // Handle errors
        console.error('Failed to update nilai:', response.statusText);
      }
  
      // Close the modal
      setShowModal(false);
    } catch (error) {
      console.error('Error updating nilai:', error);
    }
  };

  if (firstApiError || secondApiError || thirdApiError) {
    console.error('Error fetching data:', firstApiError || secondApiError);
    return <div>Error loading group details</div>;
  }  

return (
<>
  <Head>
    <title>Detail Nilai</title>
    <meta property="og:title" content="Dashboard" key="title" />
  </Head>

  <div className="flex flex-row bg-primaryColor justify-start">
    <div className="h-screen w-screen overflow-auto grow">
        <div className='absolute my-2 mx-4 md:my-6 md:mx-6 bg-white p-2 rounded-full drop-shadow-xl z-40'>
            <Link href='/dosen/nilai' className="text-xl"><IoChevronBackOutline /></Link>
        </div>
        {/* <Navbar /> */}
        <div className="mt-8 mb-2 ml-6 md:ml-10 md:mt-6 md:mb-4 font-bold text-2xl md:text-5xl text-white flex justify-center">
          <h1>Nilai Kelompok</h1>
        </div>
        <div className="md:flex md:justify-center md:items-center">
        {tablesList && tablesList.length > 0 ? (tablesList
            .filter((item2) => item2.kelompok_id === Number(router.query.id))
            .map((item2) => (
            <div className="p-3 md:py-4 md:px-8 mx-4  bg-white shadow-lg rounded-xl md:w-auto" key={item2.kelompok_id}>                  
              <h1 className="text-2xl font-bold text-gray-900 flex justify-center items-center">
                  {item2.kelompok_name}
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
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2s'>Nilai</th>
                                  <th scope='col' className='py-1 px-2 md:px-4 md:py-2s'>Act</th>
                                </tr>
                            </thead>
                            <tbody className='text-left md:text-center'>
                            {mahasiswaData && mahasiswaData.length>0?(mahasiswaData
                                  .filter((item3) => item3.kelompok_name === item2.kelompok_name)
                                  .map((filteredItem, j) => (
                                    <tr key={filteredItem.nim}>
                                      <td scope='col' className='px-4'>{j + 1 ||"-"}</td>
                                      <td scope='col' className='px-4'>{filteredItem.mahasiswa_name ||"-"}</td>
                                      <td scope='col' className='px-4'>{filteredItem.nim||"-"}</td>
                                      <td scope='col' className='px-4'>{filteredItem.mahasiswa_jurusan ||"-"}</td>
                                      <td scope='col' className='px-4'>{filteredItem.mahasiswa_fakultas || "-"}</td>
                                      <td scope='col' className='px-4'>{filteredItem.mahasiswa_telpon || "-"}</td>
                                      <td scope='col' className='px-4'>{filteredItem.mahasiswa_nilai || "-"}</td>
                                      <td className="py-1 px-3 lg:p-3">
                                        <button 
                                          onClick={() => setShowModal(true, filteredItem.nim)}
                                          className="bg-red-600 hover:bg-red-700 text-center p-1 text-white cursor-pointer rounded-md"
                                        >
                                          Ubah Nilai
                                        </button>
                                      </td>
                                    </tr>
                              ))):(
                                  <tr>
                                      <td scope='col' className='px-4'>-</td>
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
              
              <h1 className="text-xl font-bold text-gray-900 flex justify-center items-center">
                  -
              </h1>
                <div className=" pb-2 text-left">
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
                                <th scope='col' className='py-1 px-2 md:py-2 md:px-4'>Nilai</th>
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

  <Modal isVisible={isVisible} onClose={() => setShowModal(false)} nim={nim}>
  <div className="px-6 pb-2 lg:px-8 text-left">
    <h3 className="text-xl font-semibold text-gray-900 flex justify-center items-center mb-4">
      Masukan Nilai
    </h3>
    <form className="space-y-4" action="#">
      <div className='flex justify-center space-x-2'>
        <div className='w-1/2'>
          <input
            type="number"
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="Masukkan Nilai"
            id="nilai"
            value={enteredNilai}
            onChange={(e) => {
              const newValue = e.target.value;
              // Replace or filter out the "-" character
              const sanitizedValue = newValue.replace(/-/g, '');
              // Ensure the sanitized value is a non-negative number
              if (!isNaN(sanitizedValue)) {
                // Ensure the value is between 0 and 100
                const numericValue = parseFloat(sanitizedValue);
                if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
                  setEnteredNilai(sanitizedValue);
                }
              }
            }}
            className="w-full h-full bg-gray-50 border border-gray-300 text-lg text-center rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
          />
        </div>
      </div>

      <div className='flex justify-center space-x-5'>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleSimpan(nim);
            }}
            className="w-[1/2] mt-4 place-self-end text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-lg px-5 py-1 text-center"
          >
            Simpan
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="w[1/2] mt-4 px-5 py-1 font-medium text-lg  text-center bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Batal
          </button>
        </div>

    </form>
  </div>
</Modal>

</>
);
}