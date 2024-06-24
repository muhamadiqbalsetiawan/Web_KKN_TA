import { useRouter } from "next/router";
import Link from "next/link";
import { IoChevronBackOutline } from "react-icons/io5";
import useSWR from "swr";
import Head from "next/head";

export default function DetailNilai() {
  const router = useRouter();
  const { id } = router.query;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data = [], error } = useSWR(
    id ? `/api/admin/mahasiswa/nilaiDetailQuery?id=${id}` : null,
    fetcher
  );
  const { data: data2 = [], error: error2 } = useSWR(
    id ? `/api/admin/setting/kelompokDetailQuery?id=${id}` : null,
    fetcher
  );

  if (error || error2) {
    return <div>Error loading group details</div>;
  }

  if (!data || !data2) {
    return <div>Loading... Data Error</div>;
  }

  return (
    <>
      <Head>
        <title>Admin | Nilai Kelompok {id}</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      <div className="absolute bg-primaryColor h-screen w-screen">
        <div className="absolute mx-2 mt-4 bg-white p-2 rounded-full drop-shadow-xl">
          <Link href="/admin/mahasiswa/nilai" className="text-xl">
            <IoChevronBackOutline />
          </Link>
        </div>
        <h1 className="flex justify-center items-center text-white text-4xl font-bold mt-8">
          Detail Nilai Mahasiswa
        </h1>
        <div className="absolute px-5 md:left-32 md:right-32 md:top-24 py-5 rounded-xl bg-gray-50 shadow-lg flex justify-between h-auto w-auto">
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
                <h1 className="font-bold text-4xl flex items-center justify-center mb-3 text-center">
                  Kelompok : -
                </h1>
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
                      PTN
                    </th>
                    <th scope="col" className="py-2 px-4">
                      Nilai KKN
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data && data.length > 0 ? (
                    data.map((data, i) => (
                      <tr key={data.id}>
                        <td scope="col" className="px-4 py-2">
                          {i + 1}
                        </td>
                        <td scope="col" className="px-4 py-2">
                          {data.name}
                        </td>
                        <td scope="col" className="px-4 py-2">
                          {data.nim}
                        </td>
                        <td scope="col" className="px-4 py-2">
                          {data.jurusan}
                        </td>
                        <td scope="col" className="px-4 py-2">
                          {data.fakultas}
                        </td>
                        <td scope="col" className="px-4 py-2">
                          {data.universitas}
                        </td>
                        <td scope="col" className="px-4 py-2">
                          {data.nilai || "-"}
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
      </div>
    </>
  );
}
