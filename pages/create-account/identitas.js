import React, { useEffect, useState } from "react";
import Link from "next/link";
import Select from "react-select";
import useSWR from "swr";
import { useRouter } from "next/router";
import Loading from "../loading";
import ErrorModal from "@/components/modalerror";

export default function Identitas() {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [errorModal, setErrorModal] = useState(false);

  const handleCloseModal = () => {
    setErrorModal(false);
  };

  useEffect(() => {
    localStorage.removeItem("username");
  }, []);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [] } = useSWR(`/api/ptnQuery`, fetcher);

  const namaPtn = tables.map((table) => ({
    value: table.id_ptn,
    label: table.nama_ptn,
  }));

  const image =
    "https://storage-uinbdg.s3.ap-southeast-3.amazonaws.com/upload_salam/foto_profil_salam/default_user.png";

  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    jk: "",
    nama_jur: "",
    fakultas: "",
    universitas: "",
    telepon_seluler: "",
    telepon_wali: "",
    foto: image,
  });

  const signUp = async (formData) => {
    const response = await fetch("/api/mahasiswa/profilSave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      <Loading />;
      router.push("/create-account/password");
      localStorage.setItem("username", formData.nim);
      // console.log("Sign-up successfull!");
    } else {
      console.error("Sign-up failed", response.statusText);
      setErrorModal(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);
    signUp(formData);
  };

  return (
    <>
      <ErrorModal
        isOpen={errorModal}
        onClose={handleCloseModal}
        isTitle={"Data Mahasiswa Telah Digunakan"}
        isMessage={"Mohon Masukan Data Yang Benar!!"}
      />
      <div className="absolute -z-10 bg-fixed bg-cover bg-top w-screen h-screen bg-[url(/images/Kampus2Depan.jpeg)]"></div>
      <div className="bg-primaryColor w-screen h-screen py-2 px-4 md:px-10 md:py-7 bg-opacity-85">
        <div className="flex justify-start flex-col md:flex-row md:space-x-5">
          <div className="w-auto">
            <picture>
              <img
                src="https://uinsgd.ac.id/wp-content/uploads/2019/12/Logo-UIN-Putih.png"
                alt="logo"
                className="w-14 md:w-[100px]"
              />
            </picture>
          </div>
          <div className="flex justify-center items-center mt-4 mx-1 md:w-10/12">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-center text-sm md:text-2xl font-medium font-sans text-white mb-3">
                Hanya Untuk Mahasiswa Dari Luar UIN Sunan Gunung Djati Bandung
              </h1>
              <div className="bg-white px-8 py-5 rounded-lg shadow-lg md:4/5 lg:w-3/4">
                <h1 className="text-xl md:text-2xl font-bold text-center text-gray-700">
                  Biodata Mahasiswa
                </h1>
                <div className="mt-1">
                  <form className="" onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="name"
                        className="text-base md:text-lg font-semibold text-gray-800"
                      >
                        Nama
                      </label>

                      <div>
                        <input
                          id="name"
                          type="text"
                          placeholder="Nama Lengkap"
                          className="block text-base md:text-lg w-full px-2 md:px-4 py-1 md:mt-2 text-gray-700 bg-gray-50 border rounded-md focus:bg-white focus:border-inputHoverColor focus:ring-inputHoverColor focus:outline-none focus:ring focus:ring-opacity-40"
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nama: e.target.value,
                            })
                          }
                        ></input>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 space-x-2 md:space-x-4">
                      <div>
                        <div>
                          <label
                            htmlFor="nim"
                            className="text-base md:text-lg font-semibold text-gray-800"
                          >
                            NIM
                          </label>
                        </div>
                        <div>
                          <input
                            id="nim"
                            type="text"
                            placeholder="NIM"
                            className="block text-base md:text-lg w-full px-2 md:px-4 py-1 md:mt-2 text-gray-700 bg-gray-50 border rounded-md focus:bg-white focus:border-inputHoverColor focus:ring-inputHoverColor focus:outline-none focus:ring focus:ring-opacity-40"
                            required
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                nim: e.target.value,
                              })
                            }
                          ></input>
                        </div>
                      </div>
                      <div>
                        <div>
                          <label
                            htmlFor="gender"
                            className="text-base md:text-lg font-semibold text-gray-800"
                          >
                            Jenis Kelamin
                          </label>
                        </div>
                        <div>
                          <select
                            id="gender"
                            className="block text-base md:text-lg w-full px-2 md:px-4 py-1 md:mt-2 text-gray-700 bg-gray-50 border rounded-md focus:bg-white focus:border-inputHoverColor focus:ring-inputHoverColor focus:outline-none focus:ring focus:ring-opacity-40"
                            required
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                jk: e.target.value,
                              })
                            }
                          >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <label
                          htmlFor="jurusan"
                          className="text-base md:text-lg font-semibold text-gray-800"
                        >
                          Program Studi{" "}
                          <span className="text-red-700 font-normal">
                            *ditulis lengkap tanpa singkatan
                          </span>
                        </label>
                      </div>
                      <div>
                        <input
                          id="jurusan"
                          type="text"
                          placeholder="Program Studi"
                          className="block text-base md:text-lg w-full px-2 md:px-4 py-1 md:mt-2 text-gray-700 bg-gray-50 border rounded-md focus:bg-white focus:border-inputHoverColor focus:ring-inputHoverColor focus:outline-none focus:ring focus:ring-opacity-40"
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nama_jur: e.target.value,
                            })
                          }
                        ></input>
                      </div>
                    </div>
                    <div>
                      <div>
                        <label
                          htmlFor="fakultas"
                          className="text-base md:text-lg font-semibold text-gray-800"
                        >
                          Fakultas{" "}
                          <span className="text-red-700 font-normal">
                            *ditulis lengkap tanpa singkatan
                          </span>
                        </label>
                      </div>
                      <div>
                        <input
                          id="fakultas"
                          type="text"
                          placeholder="Fakultas"
                          className="block text-base md:text-lg w-full px-2 md:px-4 py-1 md:mt-2 text-gray-700 bg-gray-50 border rounded-md focus:border-inputHoverColor focus:ring-inputColor focus:outline-none focus:ring focus:ring-opacity-40"
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fakultas: e.target.value,
                            })
                          }
                        ></input>
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="text-base md:text-lg font-semibold text-gray-800">
                          Nama Perguruan Tinggi
                        </label>
                      </div>
                      <div>
                        {/* <input
                      id="pt"
                      type="text"
                      placeholder="Nama Perguruan Tinggi"
                      className="block text-base md:text-lg w-full px-2 md:px-4 py-1 md:mt-2 text-gray-700 bg-[#D9D9D9] border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    ></input> */}
                        <Select
                          id="pt"
                          className="block text-base md:text-lg w-full md:mt-2 text-gray-700 rounded-md"
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              backgroundColor: state.isFocused
                                ? "white"
                                : "#f9fafb",
                              "input:focus": {
                                boxShadow: "none",
                              },
                            }),
                          }}
                          isClearable={true}
                          isSearchable={true}
                          name="pt"
                          options={namaPtn}
                          placeholder="Pilih Perguruan Tinggi..."
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              universitas: e?.label,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 space-x-2 md:space-x-4">
                      <div>
                        <div>
                          <label
                            htmlFor="telp"
                            className="text-base md:text-lg font-semibold text-gray-800"
                          >
                            Nomor Telepon Mahasiswa
                          </label>
                        </div>
                        <div>
                          <input
                            id="telp"
                            type="text"
                            placeholder="Nomor Telepon Mahasiswa"
                            className="block text-base md:text-lg w-full px-2 md:px-4 py-1 md:mt-2 text-gray-700 bg-gray-50 border rounded-md focus:border-inputHoverColor focus:ring-inputHoverColor focus:outline-none focus:ring focus:ring-opacity-40"
                            required
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                telepon_seluler: e.target.value,
                              })
                            }
                          ></input>
                        </div>
                      </div>
                      <div>
                        <div>
                          <label
                            htmlFor="telp_wali"
                            className="text-base md:text-lg font-semibold text-gray-800"
                          >
                            Nomor Telepon Orang Tua
                          </label>
                        </div>
                        <div>
                          <input
                            id="telp_wali"
                            type="text"
                            placeholder="Nomor Telpon Orangtua"
                            className="block text-base md:text-lg w-full px-2 md:px-4 py-1 md:mt-2 text-gray-700 bg-gray-50 border rounded-md focus:border-inputHoverColor focus:ring-inputHoverColor focus:outline-none focus:ring focus:ring-opacity-40"
                            required
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                telepon_wali: e.target.value,
                              })
                            }
                          ></input>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end items-center space-x-2">
                      <div>
                        <Link
                          href="/login"
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm md:text-base font-semibold text-white rounded-md"
                        >
                          BACK
                        </Link>
                      </div>
                      <div className="">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-inputColor hover:bg-inputHoverColor text-sm md:text-base font-semibold text-white rounded-md"
                        >
                          SUBMIT
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
