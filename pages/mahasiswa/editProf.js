import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Loading from "../loading";

export default function EditProfil() {
  const router = useRouter();
  const { data: Session, status } = useSession();

  // Fetcher function to use with useSWR
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  // Additional state for API data
  const { data: apiData, error: apiError } = useSWR(
    `/api/mahasiswa/fetchData`,
    fetcher
  );

  // Additional state for API data
  const { data: apiJurData, error: apiJurError } = useSWR(
    `/api/mahasiswa/fetchJurData`,
    fetcher
  );

  const { data: isData, error: error2 } = useSWR(
    `/api/mahasiswa/checkUsername?username=${Session?.user?.username}`,
    fetcher
  );

  const [universitas, setUniversitas] = useState([]);
  const uin = "UNIVERSITAS ISLAM NEGERI SUNAN GUNUNG DJATI BANDUNG";

  const imageProf = Session?.user?.image;

  const [originalData, setOriginalData] = useState([]);
  const [formData, setFormData] = useState({
    nim: "",
    image: "",
    nama: "",
    jk: "",
    nama_jur: "",
    fakultas: "",
    universitas: "",
    telepon_seluler: "",
    telepon_wali: "",
    foto: "",
  });

  // Update formData with fetched data when apiData changes
  useEffect(() => {
    if (status === "authenticated" && apiData) {
      setFormData({
        nim: apiData.nim || "",
        nama: apiData.nama || "",
        jk: apiData.jk || "",
        nama_jur: apiData.jurusan[0]?.nama_jur || "", // Assuming index 7 exists
        fakultas: apiData.jurusan[0]?.fakultas || "", // Assuming index 19 exists
        universitas: apiData.jurusan[0]?.fakultas ? uin : "",
        telepon_seluler: apiData.telepon_seluler || "",
        telepon_wali: apiData.telepon_rumah || "",
        foto: imageProf || "",
      });
    }
  }, [apiData, imageProf, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/mahasiswa/profilSave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message or redirect
        console.log("Profile updated successfully!");

        // Redirect to /mahasiswa/dashboard immediately
        router.push("/mahasiswa/dashboard");
      } else {
        // Handle error, e.g., show an error message
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  let displayEditProfil = "";
  const role = Session?.user?.role;

  if (status === "loading") {
    // Optional: You may want to show a loading indicator while checking authentication status
    return <Loading />;
  }
  if (status === "authenticated" && role === "mahasiswa") {
    if (isData === true) {
      displayEditProfil = "";
      router.push("/mahasiswa/dashboard");
    } else {
      displayEditProfil = (
        <>
          <div className="absolute bg-primaryColor w-full h-72 -z-20"></div>
          <div className="flex flex-row justify-start">
            <div className="h-screen w-screen overflow-auto grow">
              <div className="px-5 md:px-12 pb-5 w-auto">
                <div className="mb-5 mt-10 md:mb-10 font-bold text-2xl md:text-5xl text-white">
                  <h1>Profil Mahasiswa</h1>
                </div>

                <div className="p-4 md:p-9 bg-white rounded-lg md:rounded-2xl flex flex-col justify-between font-medium shadow-lg">
                  <form onSubmit={handleSubmit}>
                    <div className="pb-7 pt-2">
                      <h1 className="text-2xl font-extrabold">
                        Detail Biodata
                      </h1>
                    </div>
                    <div className="mb-1 flex items-center text-base">
                      <h1 className="w-40 md:w-56 font-bold text-gray-900">
                        NIM
                      </h1>
                      <span
                        id="nim"
                        className="w-full px-3 py-2 text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        {formData.nim}
                      </span>
                    </div>
                    <div className="mb-1 flex items-center text-base">
                      <h1 className="w-40 md:w-56 font-bold text-gray-900">
                        Nama Lengkap
                      </h1>
                      <span
                        id="name"
                        className="w-full px-3 py-2 text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        {formData.nama}
                      </span>
                    </div>

                    {formData.jk === "" || formData.jk === null ? (
                      <div className="mb-1 flex items-center text-base">
                        <label
                          htmlFor="gender"
                          className="w-[167px] md:w-[228px] font-bold text-gray-900"
                        >
                          Jenis Kelamin
                        </label>
                        <select
                          id="gender"
                          className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.jk || ""}
                          required
                          onChange={(e) =>
                            setFormData({ ...formData, jk: e.target.value })
                          }
                        >
                          <option value="" disabled>
                            Select Gender
                          </option>
                          <option value="L">LAKI - LAKI</option>
                          <option value="P">PEREMPUAN</option>
                        </select>
                      </div>
                    ) : (
                      <div className="mb-1 flex items-center text-base">
                        <h1 className="w-40 md:w-56 font-bold text-gray-900">
                          Jenis Kelamin
                        </h1>
                        <span
                          id="gender"
                          className="w-full px-3 py-2 text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          {formData.jk}
                        </span>
                      </div>
                    )}
                    {formData.nama_jur === "" || formData.nama_jur === null ? (
                      <div className="mb-1 flex items-center text-base">
                        <label
                          htmlFor="jurusan"
                          className="w-40 md:w-56 font-bold text-gray-900"
                        >
                          Program Studi
                        </label>
                        <input
                          type="text"
                          id="jurusan"
                          className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                          value={formData.nama_jur}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nama_jur: e.target.value,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <div className="mb-1 flex items-center text-base">
                        <h1 className="w-40 md:w-56 font-bold text-gray-900">
                          Program Studi
                        </h1>
                        <span
                          id="prodi"
                          className="w-full px-3 py-2 text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          {formData.nama_jur}
                        </span>
                      </div>
                    )}
                    {formData.fakultas === "" || formData.fakultas === null ? (
                      <div className="mb-1 flex items-center text-base">
                        <label
                          htmlFor="fakultas   "
                          className="w-40 md:w-56 font-bold text-gray-900"
                        >
                          Fakultas
                        </label>
                        <input
                          type="text"
                          id="fakultas"
                          className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                          value={formData.fakultas}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fakultas: e.target.value,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <div className="mb-1 flex items-center text-base">
                        <h1 className="w-40 md:w-56 font-bold text-gray-900">
                          Fakultas
                        </h1>
                        <span
                          id="fakultas"
                          className="w-full px-3 py-2 text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          {formData.fakultas}
                        </span>
                      </div>
                    )}
                    {formData.universitas === "" ||
                    formData.universitas === null ? (
                      <div className="mb-1 flex items-center text-base">
                        <label
                          htmlFor="universitas   "
                          className="w-40 md:w-56 font-bold text-gray-900"
                        >
                          Universitas
                        </label>
                        <input
                          type="text"
                          id="universitas"
                          className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                          value={formData.universitas}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              universitas: e.target.value,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <div className="mb-1 flex items-center text-base">
                        <h1 className="w-40 md:w-56 font-bold text-gray-900">
                          Universitas
                        </h1>
                        <span
                          id="universitas"
                          className="w-full px-3 py-2 text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          {formData.universitas}
                        </span>
                      </div>
                    )}

                    <div className="mb-2 flex items-center text-base">
                      <label
                        htmlFor="telp"
                        className="w-40 md:w-56 font-bold text-gray-900"
                      >
                        Nomor Telpon Mahasiswa
                      </label>
                      <input
                        type="text"
                        id="telp"
                        className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                        value={formData.telepon_seluler}
                        maxLength={16}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            telepon_seluler: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-2 flex items-center text-base">
                      <label
                        htmlFor="telp"
                        className="w-40 md:w-56 font-bold text-gray-900"
                      >
                        Nomor Telpon Orang Tua
                      </label>
                      <input
                        type="text"
                        id="telp"
                        maxLength={16}
                        className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                        value={formData.telepon_wali}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            telepon_wali: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mt-5">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-inputColor hover:bg-inputHoverColor text-white rounded-md font-bold"
                      >
                        SIMPAN
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  } else if (status === "authenticated" && role === "dosen") {
    displayEditProfil = "";
    router.push("/dosen/dashboard");
  } else {
    displayEditProfil = "";
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>Profil Mahasiswa</title>
        <meta property="og:title" content="Profil Mahasiswa" key="title" />
      </Head>
      {displayEditProfil}
    </>
  );
}
