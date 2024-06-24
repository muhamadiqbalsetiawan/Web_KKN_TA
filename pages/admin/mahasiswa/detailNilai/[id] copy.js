import { useRouter } from "next/router";
import Link from "next/link";
import { IoChevronBackOutline } from "react-icons/io5";
import useSWR from "swr";

export default function DetailNilai() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error } = useSWR(
    id ? `/api/admin/mahasiswa/detail/${id}` : null
  );
  if (error) {
    return <div>Error loading group details</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="absolute bg-IjoRumput h-screen w-screen">
        <div className="absolute mx-2 mt-4 bg-white p-2 rounded-full drop-shadow-xl">
          <Link href="/admin/mahasiswa/nilai" className="text-xl">
            <IoChevronBackOutline />
          </Link>
        </div>
        <h1 className="flex justify-center items-center text-white text-4xl font-bold mt-8">
          Detail Nilai Mahasiswa
        </h1>
        <div className="absolute px-5 md:left-32 md:right-32 md:top-24 py-5 rounded-xl bg-iceGray flex justify-between h-auto w-auto">
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
            <div>
              <h1 className="font-bold text-4xl flex items-center justify-center mb-3 text-center">
                {kelompok}
              </h1>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                  Jenis KKN
                </h2>
                <p className="text-lg flex items-center justify-center text-center">
                  {jenis}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                  Lokasi KKN
                </h2>
                <p className="text-lg flex items-center justify-center text-center">
                  {lokasi}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                  Dosen Pembimbing:
                </h2>
                <p className="text-lg flex items-center justify-center text-center">
                  {dosen}
                </p>
                <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                  No Telepon:
                </h2>
                <p className="text-lg flex items-center justify-center text-center">
                  089645272874
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white w-2/3 grid justify-center items-center ml-8 py-8 my-8 rounded-xl">
            <div className="relative overflow-x-auto overflow-y-auto bg-white max-h-80">
              <table className=" text-lg text-gray-500 dark:text-gray-400 min-w-full w-full text-left rtl:text-right ">
                <thead className=" text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
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
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td scope="col" className="px-4">
                        {index + 1}
                      </td>
                      <td scope="col" className="px-4">
                        {item.name}
                      </td>
                      <td scope="col" className="px-4">
                        {item.nim}
                      </td>
                      <td scope="col" className="px-4">
                        {item.jurusan}
                      </td>
                      <td scope="col" className="px-4">
                        {item.fakultas}
                      </td>
                      <td scope="col" className="px-4">
                        {item.nilai}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
