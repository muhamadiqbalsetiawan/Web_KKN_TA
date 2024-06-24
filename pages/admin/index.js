import Head from "next/head";
import MyImage from "../../public/images/Group 9.png";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import ErrorModal from "@/components/modalerror";

export default function Login() {
  const [open, setOpen] = useState(false);
  // handle toggle
  const FaToggle = () => {
    setOpen(!open);
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorModal, setErrorModal] = useState(false);

  const handleCloseModal = () => {
    setErrorModal(false);
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      localStorage.removeItem("username");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/admin/login", {
        username,
        password,
      });

      if (response.data.success) {
        // console.log(response.data.data);
        // Redirect to the admin dashboard
        window.location.href = "/admin/dashboard";
        localStorage.setItem("username", response.data.data.name);
      } else {
        // alert(response.data.message);
        setErrorModal(true);
      }
    } catch (error) {
      // console.error(error);
      // alert("An error occurred while logging in.");
      setErrorModal(true);
    }
  };

  return (
    <>
      <Head>
        <title>Admin | Admin</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      <ErrorModal
        isOpen={errorModal}
        onClose={handleCloseModal}
        isTitle={"Username atau Password Salah"}
        isMessage={"Mohon Diingat Kembali Username atau Password Anda!"}
      />
      <div className="h-full w-full flex">
        <div className="absolute -z-10 bg-fixed bg-cover w-screen h-screen bg-bottom bg-[url(/images/Kampus2Depan.jpeg)]"></div>
        <div className="h-screen relative z-0 w-full bg-primaryColor bg-opacity-85 md:bg-opacity-90">
          <div className="pl-9 pt-8">
            <picture>
              <img
                src="https://uinsgd.ac.id/wp-content/uploads/2019/12/Logo-UIN-Putih.png"
                alt="Logo UIN"
                className="w-20"
              />
            </picture>
          </div>
          <div className="pl-9 pt-8 font-darkerGrotesque font-bold text-white text-2xl">
            <p>Silahkan Login</p>
            <p>Dengan menggunakan</p>
            <p>Akun Admin</p>
          </div>
        </div>

        <div className="h-[680px] rounded-bl-md w-3/4 right-0 absolute z-10 bg-white">
          <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-1/4">
              <h1 className="text-4xl font-bold text-center text-gray-700 mb-2 w-full">
                Login
              </h1>
              <h2 className="text-xl font-medium text-center">Admin</h2>

              <form className="mt-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="w-full">
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Username"
                        name="username"
                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 focus:bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                      />
                    </div>
                    <div className="text-sm absolute top-3 right-2">
                      <FaUser />
                    </div>
                  </div>
                </div>
                <div className="mb-2 mx-auto relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="w-full">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={open === true ? "text" : "password"}
                        placeholder="Enter Your Password"
                        name="password"
                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-50 focus:bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
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

                <div className="mt-6 flex justify-center">
                  <button className="w-[40%] py-2 tracking-wide text-white font-bold transition-colors duration-200 transform bg-inputColor rounded-md hover:bg-inputHoverColor focus:outline-none focus:bg-[#8FBB63]">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="absolute z-20 translate-y-[290px] translate-x-32">
          <Image
            src={MyImage}
            alt="Image"
            className="md:w-[420px] xl:w-[530px]"
          />
        </div>
      </div>
    </>
  );
}
