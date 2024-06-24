import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { FaEyeSlash, FaEye, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";

const Password = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const router = useRouter();

  const role = "mahasiswa";
  const image =
    "https://storage-uinbdg.s3.ap-southeast-3.amazonaws.com/upload_salam/foto_profil_salam/default_user.png";

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username != null) {
      setUsername(username);
    } else {
      router.push("/create-account/identitas");
    }
  }, [router]);

  // handle toggle
  const FaToggle = () => {
    setOpen(!open);
  };

  const signUp = async (username, password) => {
    const response = await fetch("/api/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, role, image }),
    });

    if (response.ok) {
      router.push("/login");
      localStorage.removeItem("username");
      // console.log("Sign-up successfull!");
    } else {
      console.error("Sign-up failed", response.statusText);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    signUp(username, password);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleOpenModal = (id) => {
    setIsOpen(true);
    setSelectedItem(id);
  };

  const handleDelete = async (item) => {
    // const confirmed = window.confirm("Are you sure you want to delete this data?");
    console.log(item);
    // if (confirmed) {
    try {
      const response = await fetch("/api/mahasiswa/deleteSignup", {
        method: "DELETE",
        body: JSON.stringify({ item }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/create-account/identitas");
        localStorage.removeItem("username");
      } else {
        console.error("Error deleting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    // }
  };

  return (
    <>
      <div className="absolute -z-10 bg-fixed bg-cover bg-top w-screen h-screen bg-[url(/images/Kampus2Depan.jpeg)]"></div>
      <div className="bg-primaryColor w-screen h-screen py-4 px-6 md:px-10 md:py-7 bg-opacity-85">
        <div className="flex justify-start space-y-5 md:space-y-0 flex-col md:flex-row md:space-x-5 h-full">
          <div className="w-auto">
            <picture>
              <img
                src="https://uinsgd.ac.id/wp-content/uploads/2019/12/Logo-UIN-Putih.png"
                alt="logo"
                className="w-14 md:w-[100px]"
              />
            </picture>
          </div>
          <div className="flex justify-center items-center md:w-10/12">
            <div className="flex flex-col justify-center items-center md:mt-6 bg-white px-7 py-5 rounded-lg shadow-lg">
              <h1 className="text-lg md:text-3xl font-bold text-center text-gray-700">
                Konfirmasi Password
              </h1>
              <div className="mt-3 md:mt-6 w-full">
                <div className="w-full">
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="name"
                        className="text-base md:text-lg font-semibold text-gray-800"
                      >
                        Username
                      </label>
                      <div className="relative">
                        <div className="w-full">
                          <span
                            type="text"
                            placeholder="Username"
                            name="username"
                            className="block text-xs md:text-sm lg:text-base w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border rounded-md focus:border-inputHoverColor focus:ring-inputHoverColor focus:outline-none focus:ring focus:ring-opacity-40"
                          >
                            {username}
                          </span>
                        </div>
                        <div className="text-sm absolute top-3 right-2">
                          <FaUser />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="jurusan"
                        className="text-base md:text-lg font-semibold text-gray-800"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div className="w-full">
                          <input
                            type={open === false ? "password" : "text"}
                            placeholder="Enter Your Password"
                            name="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="block text-xs md:text-sm lg:text-base w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border rounded-md focus:border-inputColor focus:ring-inputHoverColor focus:outline-none focus:ring focus:ring-opacity-40"
                          />
                        </div>

                        <div className="text-sm absolute top-3 right-2">
                          {open === false ? (
                            <FaEyeSlash onClick={FaToggle} />
                          ) : (
                            <FaEye onClick={FaToggle} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="fakultas"
                        className="text-base md:text-lg font-semibold text-gray-800"
                      >
                        Konfirmasi Password
                      </label>
                      <div className="relative">
                        <div className="w-full">
                          <input
                            type={open === false ? "password" : "text"}
                            placeholder="Confirm Your Password"
                            name="password"
                            required
                            //   value={password}
                            //   onChange={(e) => setPassword(e.target.value)}
                            className="block text-xs md:text-sm lg:text-base w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 border rounded-md focus:border-inputColor focus:ring-inputHoverColor focus:outline-none focus:ring focus:ring-opacity-40"
                          />
                        </div>

                        <div className="text-sm absolute top-3 right-2">
                          {open === false ? (
                            <FaEyeSlash onClick={FaToggle} />
                          ) : (
                            <FaEye onClick={FaToggle} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-2">
                      <div
                        onClick={() => handleOpenModal(username)}
                        className="px-4 py-2 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-xs md:text-base font-semibold text-white rounded-md cursor-pointer"
                      >
                        BACK
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="px-4 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-xs md:text-base font-semibold text-white rounded-md"
                        >
                          SIMPAN
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
                  Apakah anda yakin ingin menghapus Data Identitas Sebelumnya?
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-gray-500">
                    Anda tidak dapat mengembalikan data yang sudah dihapus.
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
    </>
  );
};

export default Password;
