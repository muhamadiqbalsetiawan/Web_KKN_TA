import Modal from "@/components/admin/modal";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import { IoChevronBackOutline } from "react-icons/io5";
import useSWR from "swr";
import Head from "next/head";

export default function DetailLaporan() {
  const router = useRouter();
  const { id } = router.query;

  const fetcher = (url) => fetch(url).then((res) => res.json());

  // First API (item)
  const { data: tables = [], firstApiError } = useSWR(
    id ? `/api/admin/dosen/kelompokQueryDetail?id=${id}` : null,
    fetcher
  );

  // Second API call (item2)
  const { data: tablesList = [], thirdApiError } = useSWR(
    id ? `/api/admin/dosen/kelompokListQuery?id=${id}` : null,
    fetcher
  );

  // Third API call (item3)
  const { data: mahasiswaData, error: secondApiError } = useSWR(
    id && id
      ? `/api/admin/dosen/kelompokMahasiswaQuery?id=${id}&id${id}`
      : null,
    fetcher
  );

  const [selectedKelompok, setSelectedKelompok] = useState(null);
  const [showModal, setShowModal] = useState(false);

  if (firstApiError || secondApiError || thirdApiError) {
    console.error("Error fetching data:", firstApiError || secondApiError);
    return <div>Error loading group details</div>;
  }

  const handleDetailClick = (kelompok) => {
    setSelectedKelompok(kelompok);
    setShowModal(true);
  };

  return (
    <>
      <Head>
        <title>Admin | Nilai Kelompok {id}</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      <div className="bg-primaryColor w-screen h-screen flex justify-center">
        <div className="absolute px-5  w-full ">
          <div className="absolute mx-2 mt-4 bg-white p-2 rounded-full drop-shadow-xl">
            <Link href="/admin/dosen/nilai" className="text-xl">
              <IoChevronBackOutline />
            </Link>
          </div>
          <h1 className="flex justify-center items-center text-white text-4xl font-bold mt-8">
            Detail Nilai
          </h1>

          {tables && tables.length > 0 ? (
            tables.map((item) => (
              <div
                className="bg-white shadow-lg h-auto w-auto flex justify-between items-center rounded-lg px-8 my-4"
                key={item.nip}
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
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    Dosen Pembimbing:
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    {item.dosen_name}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    Kelompok Binaan
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    {item.kelompok_ids}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    Jenis KKN
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    {item.jenis_kelompok}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    No Telepon:
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    {item.telpon_dosen || "-"}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    Lokasi KKN
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    {item.lokasi_provinsi}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white shadow-lg h-auto w-auto flex justify-between items-center rounded-lg px-8 my-4">
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
                <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                  Dosen Pembimbing:
                </h2>
                <p className="text-lg flex items-center justify-center text-center">
                  -
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                  Kelompok Binaan
                </h2>
                <p className="text-lg flex items-center justify-center text-center">
                  -
                </p>
              </div>
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
                  No Telepon:
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
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center grid-cols-4 font-medium px-4 gap-6 mt-8">
            {tablesList && tablesList.length > 0 ? (
              tablesList.map((item2) => (
                <div key={item2.nip}>
                  <div className="bg-white shadow-lg grid justify-center items-center py-8 mt-4 rounded-xl">
                    <h1 className="font-bold text-4xl mb-3 text-center">
                      {item2.kelompok_name}
                    </h1>
                    <button
                      className="font-semibold text-blue-400 hover:underline"
                      onClick={() => handleDetailClick(item2)}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <div className="bg-white shadow-lg grid justify-center items-center py-8 mt-4 rounded-xl">
                  <h1 className="font-bold text-4xl mb-3 text-center">
                    Kelompok -
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div className="bg-white w-full grid justify-center items-center py-4 rounded-xl font-medium">
          {selectedKelompok && (
            <div className="relative overflow-x-auto overflow-y-auto bg-white max-h-80 w-full">
              <table className=" text-lg text-gray-500 min-w-full w-full text-left rtl:text-right ">
                <thead className=" text-white  bg-gray-500 text-center">
                  <tr className="">
                    <th scope="col" className="py-2 px-4">
                      No
                    </th>
                    <th scope="col" className="py-2 px-4">
                      Nama
                    </th>
                    <th scope="col" className="py-2 px-4">
                      NIM
                    </th>
                    <th scope="col" className="py-2 px-4">
                      Jurusan
                    </th>
                    <th scope="col" className="py-2 px-4">
                      Fakultas
                    </th>
                    <th scope="col" className="py-2 px-4">
                      Nilai KKN
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {mahasiswaData && mahasiswaData.length > 0 ? (
                    mahasiswaData
                      .filter(
                        (item3) =>
                          item3.kelompok_name === selectedKelompok.kelompok_name
                      )
                      .map((item3, j) => (
                        <tr key={item3.kelompok_name}>
                          <td scope="col" className="px-4">
                            {j + 1}
                          </td>
                          <td scope="col" className="px-4">
                            {item3.mahasiswa_name}
                          </td>
                          <td scope="col" className="px-4">
                            {item3.nim}
                          </td>
                          <td scope="col" className="px-4">
                            {item3.mahasiswa_jurusan}
                          </td>
                          <td scope="col" className="px-4">
                            {item3.mahasiswa_fakultas}
                          </td>
                          <td scope="col" className="px-4">
                            {item3.mahasiswa_telpon}
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
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
