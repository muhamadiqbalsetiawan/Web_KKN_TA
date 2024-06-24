import { useRouter } from "next/router";
import Link from "next/link";
import { IoChevronBackOutline } from "react-icons/io5";
import useSWR from "swr";
import Head from "next/head";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function DetailKelompok() {
  const router = useRouter();
  const { id } = router.query;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data = [], error } = useSWR(
    id ? `/api/admin/mahasiswa/kelompokMahasiswaDetailQuery?id=${id}` : null,
    fetcher
  );
  const { data: data2 = [], error: error2 } = useSWR(
    id ? `/api/admin/setting/kelompokDetailQuery?id=${id}` : null,
    fetcher
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleOpenModal2 = (nim) => {
    setIsOpen(true);
    setSelectedItem(nim);
  };

  const handleDelete = async (nim) => {
    // const confirmed = window.confirm("Are you sure you want to delete this data?");

    // if (confirmed) {
    try {
      const response = await fetch("/api/admin/mahasiswa/mahasiswaDelete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nim }), // Mengirim ID Dosen ke API penghapusan
      });

      if (response.ok) {
        router.reload();
      } else {
        console.error("Error deleting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    // }
  };
  
  console.log(data)

  if (error || error2) {
    return <div>Error loading group details</div>;
  }

  if (!data || !data2) {
    return <div>Loading... Data Error</div>;
  }

  return (
    <>
      <Head>
        <title>Admin | Detail Kelompok {id}</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={handleCloseModal}
        >
          <div className="min-h-screen text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Apakah anda yakin ingin menghapus Mahasiswa Ini?
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Anda tidak dapat mengembalikan item yang sudah dihapus.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelete(selectedItem)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className="absolute bg-primaryColor h-screen w-screen">
        <div className="absolute mx-2 mt-4 bg-white rounded-full p-2 drop-shadow-xl">
          <Link href="/admin/mahasiswa/kelompok" className="text-xl">
            <IoChevronBackOutline />
          </Link>
        </div>
        <div className="flex justify-center items-center mt-8">
          <h1 className="text-white text-4xl font-bold">Detail Kelompok</h1>
        </div>
        <div class="absolute px-5 md:left-32 md:right-32 md:top-24 py-2 rounded-xl bg-gray-50 shadow-lg">
          <div className="flex justify-between h-auto w-auto">
            <div className="bg-white h-full w-1/3 grid justify-center items-center rounded-lg py-3 px-3 my-8">
              <div className="font-bold text-3xl flex items-center justify-center my-4">
                <picture>
                  <img
                    src="/nav-logo2.png"
                    alt="Logo UIN"
                    className="md:w-[90px]"
                  />
                </picture>
              </div>
              {data2 && data2.length > 0 ? (
                data2.map((data2) => (
                  <div key={data2.id}>
                    <h1 className="font-bold text-4xl flex items-center justify-center mb-3 text-center">
                      {data2.kelompok_name}
                    </h1>
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                          Jenis KKN
                        </h2>
                        <p className="text-lg flex items-center justify-center text-center">
                          {data2.jenis_kelompok}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                          Lokasi KKN
                        </h2>
                        <p className="text-lg flex items-center justify-center text-center">
                          {data2.kota}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                          Dosen Pembimbing:
                        </h2>
                        <p className="text-lg flex items-center justify-center text-center">
                          {data2.dosen_name || "-"}
                        </p>
                        <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                          Ketua Kelompok
                        </h2>
                        <p className="text-lg flex items-center justify-center text-center">
                          {data2.ketua_name || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <h1 className="font-bold text-4xl flex items-center justify-center mb-3 text-center"></h1>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                        Jenis KKN
                      </h2>
                      <p className="text-lg flex items-center justify-center text-center">
                        -
                      </p>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                        Lokasi KKN
                      </h2>
                      <p className="text-lg flex items-center justify-center text-center">
                        -
                      </p>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                        Dosen Pembimbing:
                      </h2>
                      <p className="text-lg flex items-center justify-center text-center">
                        -
                      </p>
                      <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                        Ketua Kelompok
                      </h2>
                      <p className="text-lg flex items-center justify-center text-center">
                        -
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white w-2/3 grid justify-center items-center ml-8 py-8 my-8 rounded-xl">
              <div className="relative overflow-x-auto overflow-y-auto bg-white max-h-96">
                <table className=" text-lg text-gray-500 min-w-full w-full text-left rtl:text-right ">
                  <thead className=" text-white  bg-gray-500 text-center">
                    <tr className="">
                      <th scope="col" className="py-2 px-4">
                        No
                      </th>
                      <th scope="col" className="py-2 px-16">
                        Nama
                      </th>
                      <th scope="col" className="py-2 px-4">
                        NIM
                      </th>
                      <th scope="col" className="py-2 px-4">
                        Jenis Kelamin
                      </th>
                      <th scope="col" className="py-2 px-4">
                        Program Studi
                      </th>
                      <th scope="col" className="py-2 px-4">
                        Fakultas
                      </th>
                      <th scope="col" className="py-2 px-24">
                        PTN
                      </th>
                      <th scope="col" className="py-2 px-4">
                        No Telepon
                      </th>
                      <th scope="col" className="py-2 px-4">
                        Act
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {data && data.length > 0 ? (
                      data.map((data, i) => (
                        <tr key={data.id}>
                          <td scope="col" className="px-4 py-1">
                            {i + 1}
                          </td>
                          <td scope="col" className="px-4 py-1 text-left">
                            {data.name}
                          </td>
                          <td scope="col" className="px-4 py-1 text-left">
                            {data.nim}
                          </td>
                          <td scope="col" className="px-4 py-1">
                            {data.gender === "L"
                              ? "Laki-laki"
                              : data.gender === "P"
                                ? "Perempuan"
                                : "Unknown"}
                          </td>
                          <td scope="col" className="px-4 py-1">
                            {data.jurusan}
                          </td>
                          <td scope="col" className="px-4 py-1">
                            {data.fakultas}
                          </td>
                          <td scope="col" className="px-4 py-1">
                            {data.universitas}
                          </td>
                          <td scope="col" className="px-4 py-1">
                            {data.telpon}
                          </td>
                          <td scope="col" className="px-4 py-1">
                            <div
                              className="lg:w-9 bg-red-600 hover:bg-red-700 flex items-center p-2 text-white cursor-pointer rounded-lg"
                              onClick={() => handleOpenModal2(data.nim)}
                            // Tampilkan dialog konfirmasi saat tombol diklik
                            >
                              <TrashIcon
                                className="w-3 h-3 md:w-5 md:h-5"
                                style={{ strokeWidth: 2 }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td scope="col" className="px-4">
                          -
                        </td>
                        <td scope="col" className="px-4">
                          -
                        </td>
                        <td scope="col" className="px-4">
                          -
                        </td>
                        <td scope="col" className="px-4">
                          -
                        </td>
                        <td scope="col" className="px-4">
                          -
                        </td>
                        <td scope="col" className="px-4">
                          -
                        </td>
                        <td scope="col" className="px-4">
                          -
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
