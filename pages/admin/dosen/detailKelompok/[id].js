import { useRouter } from "next/router";
import Link from "next/link";
import { IoChevronBackOutline } from "react-icons/io5";
import useSWR from "swr";
import Head from "next/head";

export default function DetailKelompok() {
  const router = useRouter();
  const { id } = router.query;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

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

  if (firstApiError || secondApiError || thirdApiError) {
    console.error("Error fetching data:", firstApiError || secondApiError);
    return <div>Error loading group details</div>;
  }

  if (!tables) {
    return <div>Loading Data Errors...</div>;
  }

  if (!mahasiswaData || !tablesList) {
    return <div>Loading Data...</div>;
  }

  return (
    <>
      <Head>
        <title>Admin | Detail Kelompok {id}</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      <div className="absolute px-5 bg-primaryColor h-auto w-full ">
        <div className="absolute mx-2 mt-4 bg-white p-2 rounded-full drop-shadow-xl">
          <Link href="/admin/dosen/kelompok" className="text-xl">
            <IoChevronBackOutline />
          </Link>
        </div>
        <h1 className="flex justify-center items-center text-white text-4xl font-bold mt-8 mb-4">
          Detail Kelompok
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

        <div className=" grid md:grid-cols-4 xl:grid-cols-2 px-4 gap-6 mt-8">
          {tablesList && tablesList.length > 0 ? (
            tablesList.map((item2) => (
              <div key={item2.kelompok_id}>
                <div className="bg-white shadow-lg grid justify-center items-center py-8 mt-4 rounded-xl">
                  <h1 className="font-bold text-4xl mb-3 text-center">
                    {item2.kelompok_name || "-"}
                  </h1>
                  <h5 className="font-bold text-1xl mb-3 text-center">
                    Ketua : {item2.ketua_name || "-"}
                  </h5>
                  <h5 className="font-bold text-1xl mb-3 text-center">
                    Lokasi : {item2.lokasi_kota || item2.Lokasi_negara || "-"}
                  </h5>
                  <div className="relative overflow-x-auto overflow-y-auto bg-white max-h-80">
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
                            No Telepon
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {mahasiswaData && mahasiswaData.length > 0 ? (
                          mahasiswaData
                            .filter(
                              (item3) =>
                                item3.kelompok_name === item2.kelompok_name
                            )
                            .map((filteredItem, j) => (
                              <tr key={filteredItem.nim}>
                                <td scope="col" className="px-4">
                                  {j + 1}
                                </td>
                                <td scope="col" className="px-4">
                                  {filteredItem.mahasiswa_name}
                                </td>
                                <td scope="col" className="px-4">
                                  {filteredItem.nim}
                                </td>
                                <td scope="col" className="px-4">
                                  {filteredItem.mahasiswa_jurusan}
                                </td>
                                <td scope="col" className="px-4">
                                  {filteredItem.mahasiswa_fakultas}
                                </td>
                                <td scope="col" className="px-4">
                                  {filteredItem.mahasiswa_telpon}
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
                </div>
              </div>
            ))
          ) : (
            <div>
              <div className="bg-white shadow-lg grid justify-center items-center py-8 mt-4 rounded-xl">
                <h1 className="font-bold text-4xl mb-3 text-center">
                  Kelompok -
                </h1>
                <h5 className="font-bold text-1xl mb-3 text-center">
                  Ketua : -
                </h5>
                <h5 className="font-bold text-1xl mb-3 text-center">
                  Lokasi : -
                </h5>
                <div className="relative overflow-x-auto overflow-y-auto bg-white max-h-80">
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
                          No Telepon
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {mahasiswaData && mahasiswaData.length > 0 ? (
                        mahasiswaData.map((item3, j) => (
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
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
