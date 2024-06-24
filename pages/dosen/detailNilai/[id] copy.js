import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import Link from 'next/link';
import { IoChevronBackOutline } from "react-icons/io5";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/admin/modal";

export default function DetailKelompok() {

    const router = useRouter();
    const { id, namakelompok, ketua, anggota, telp} = router.query;

    const Nilai = [
        {
            id: 1,
            nama: "Muhamad Iqbal Setiwan",
            nim: "1207050064",
            jurusan: "Teknik Informatika",
            fakultas: "Sains dan Teknologi",
        },
        {
            id: 1,
            nama: "Muhamad Iqbal Setiwan",
            nim: "1207050064",
            jurusan: "Teknik Informatika",
            fakultas: "Sains dan Teknologi",
        },
        {
            id: 1,
            nama: "Muhamad Iqbal Setiwan",
            nim: "1207050064",
            jurusan: "Teknik Informatika",
            fakultas: "Sains dan Teknologi",
        },
        {
            id: 1,
            nama: "Muhamad Iqbal Setiwan",
            nim: "1207050064",
            jurusan: "Teknik Informatika",
            fakultas: "Sains dan Teknologi",
        },
        {
            id: 1,
            nama: "Muhamad Iqbal Setiwan",
            nim: "1207050064",
            jurusan: "Teknik Informatika",
            fakultas: "Sains dan Teknologi",
        },
      ];
    
      const itemsPerPage = 10;
      const [currentPage, setCurrentPage] = useState(1);
    
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItem = Nilai.slice(indexOfFirstItem, indexOfLastItem);
    
      const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
      }; 

      const [ showModal, setShowModal ] = useState(false);

  return (
    <>
      <Head>
        <title>Detail Nilai</title>
        <meta property="og:title" content="Dashboard" key="title" />
      </Head>

      <div className="flex flex-row bg-IjoRumput justify-start">
        <div className="h-screen w-screen overflow-auto grow">
            <div className='absolute my-2 mx-4 md:my-6 md:mx-6 bg-white p-2 rounded-full drop-shadow-xl z-40'>
                <Link href='/dosen/nilai' className="text-xl"><IoChevronBackOutline /></Link>
            </div>
            {/* <Navbar /> */}
            <div className="mt-8 mb-2 ml-6 md:ml-10 md:mt-6 md:mb-4 font-bold text-2xl md:text-5xl text-white flex justify-center">
              <h1>Nilai Kelompok</h1>
            </div>
            <div className="md:flex md:justify-center md:items-center">
                <div className="p-3 mx-4 md:mt-4 md:px-8 md:py-4 bg-iceGray rounded-xl md:w-2/3">
                    <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex justify-center items-center">
                        {namakelompok}
                    </h1>
                    <div class=" pb-2 text-left">
                        <div className="mb-2 text-sm font-semibold md:text-lg md:font-semibold">
                            <h3>Ketua : {ketua}</h3>
                            <h3>Kontak Ketua : {telp}</h3>
                            <h3>Lokasi : Desa Cipaku, Kecamatan Paseh, Kabupaten Bandung, Jawa Barat</h3>
                            <h3>Anggota :</h3>
                        </div>
                        <div className='mx-1 md:ml-4 rounded-xl  md:w-auto'>
                            <div className='relative overflow-x-auto overflow-y-auto bg-white max-h-80'>
                                <table className=' text-sm md:text-lg text-gray-500 min-w-full w-full text-left rtl:text-right '>
                                <thead className=' text-gray-700  bg-gray-50 text-left md:text-left'>
                                    <tr className=''>
                                    <th scope='col' className='py-1 px-2 md:py-2 md:px-4'>No</th>
                                    <th scope='col' className='py-1 px-2 md:py-2 md:px-4'>Nama</th>
                                    <th scope='col' className='py-1 px-2 md:py-2 md:px-4'>NIM</th>
                                    <th scope='col' className='py-1 px-2 md:py-2 md:px-4'>Jurusan</th>
                                    <th scope='col' className='py-1 px-2 md:py-2 md:px-4'>Fakultas</th>
                                    <th scope='col' className='py-1 px-2 md:py-2 md:px-4'>Nilai KKN</th>
                                    <th scope='col' className='py-1 px-2 md:py-2 md:px-4'></th>
                                    </tr>
                                </thead>
                                <tbody className="text-left">
                                    {currentItem.map((item, i) => (
                                    <tr key={i} className="border-y border-slate-300">
                                        <td className="py-1 px-0 lg:p-3">{i + 1}</td>
                                        <td className="py-1 px-1 lg:p-3">{item.nama}</td>
                                        <td className="py-1 px-2 lg:p-3">{item.nim}</td>
                                        <td className="py-1 px-2 lg:p-3">{item.jurusan}</td>
                                        <td className="py-1 px-2 lg:p-3">{item.fakultas}</td>
                                        <td className="py-1 px-2 lg:p-3">{item.nilai|| 'Belum di input'}</td>
                                        <td className="py-1 px-3 lg:p-3">
                                          <button 
                                          onClick={() =>
                                          setShowModal(true)}
                                          className="bg-red-600 hover:bg-red-700 text-center p-1 text-white cursor-pointer rounded-md">
                                            Tambah Nilai
                                          </button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end items-center mr-4 mt-5">
                                <button type="submit" className="bg-green-500 hover:bg-green-700 px-5 py-1 rounded-sm text-white font-bold">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
      <div class="px-6 pb-2 lg:px-8 text-left">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex justify-center items-center mb-4">
          Masukan Nilai
        </h3>
        <form class="space-y-4" action="#">
          <div className='flex justify-center space-x-2'>
            <div className='w-1/2'>
              <input type="name" id="name" class="w-full h-full bg-gray-50 border border-gray-300 text-lg text-center rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"/>
            </div>
          </div>

          <div className='flex justify-center space-x-5'>
              <button
                type="button"
                onClick={() => {
                  // aksi yang diperlukan saat tombol Simpan ditekan
                  // Misalnya, menyimpan data yang diedit ke server atau mengubah state lainnya
                  // Kemudian tutup modal
                  setShowModal(false);
                }}
                className="w-[1/2] mt-4 place-self-end text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-lg px-5 py-1 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Simpan
              </button>
              <button
                onClick={() => setShowModal(false)}
                class="w[1/2] mt-4 px-5 py-1 font-medium text-lg  text-center bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
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
