import Link from "next/link";
import MyImage from "../../public/images/GDPR-amico 1.png";
import Image from "next/image";
import React, { useState } from "react";
import { FaEyeSlash, FaEye, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "../loading";
import ErrorModal from "@/components/modalerror";

export default function Login() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const [userType, setUserType] = useState("mahasiswa");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let displayLogin = "";
  const router = useRouter();
  const { data: Session, status } = useSession();

  const role = Session?.user?.role;

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const [selectedButton, setSelectedButton] = useState(null);
  const [isModal, setIsModal] = useState(false);

  const handleCloseModal = () => {
    setIsModal(false);
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };
  // const [isClicked, setIsClicked] = useState(false);
  // const [isHovered, setIsHovered] = useState(false);

  // const handleClick = () => {
  //   setIsClicked(true);
  // };

  // const handleMouseEnter = () => {
  //   if (!isClicked) {
  //     setIsHovered(true);
  //   }
  // };

  // const handleMouseLeave = () => {
  //   setIsHovered(false);
  // };

  const [open, setOpen] = useState(false);
  // handle toggle
  const FaToggle = () => {
    setOpen(!open);
  };

  const handleSubmit = async (e, handleLoginFunction) => {
    e.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      setIsModal(true);
      return;
    }

    handleLoginFunction(e);
  };

  let token = "";

  if (username.length >= 18) {
    token = process.env.TOKEN_SIP;
  } else {
    token = "";
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (token != "") {
      const result = await signIn("credentials", {
        username,
        password,
        token,
        redirect: false, // Prevent automatic redirection
      });

      if (!result.error) {
        // Successful login
        console.log("Session:", result.session);
        window.location.href = "/dosen/dashboard"; // Redirect to the protected page
      } else {
        // Handle login error
        console.log("Login error:", result.error);
        window.location.href = "/login-failed"; // Redirect to the protected page
      }
    } else {
      // Attempt to sign in using the Credentials provider
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false, // Prevent automatic redirection
      });

      if (!result.error) {
        try {
          // Lakukan permintaan langsung ke server untuk memeriksa username
          const response = await fetch(
            `/api/mahasiswa/checkUsername?username=${username}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to check username");
          }

          const data = await response.json();
          console.log("data : ", data);

          if (data === true) {
            // Username ditemukan di database, arahkan ke dashboard
            console.log(
              "Username found in database. Redirecting to dashboard."
            );
            window.location.href = "/mahasiswa/dashboard";
          } else {
            // Username tidak ditemukan di database, arahkan ke halaman edit profil
            console.log(
              "Username not found in database. Redirecting to edit profile."
            );
            window.location.href = "/mahasiswa/editProf";
          }
        } catch (error) {
          console.error("Error checking username:", error);
          window.location.href = "/login"; // Redirect to the protected page
        }
      } else {
        // Handle login error
        console.log("Login error:", result.error);
        window.location.href = "/login-failed"; // Redirect to the protected page
      }
    }
  };

  // const handleLoginDosen = async (e) => {
  //   e.preventDefault();

  //   if (token != null) {
  //     // Attempt to sign in using the Credentials provider
  //     const result = await signIn("credentials", {
  //       username,
  //       password,
  //       token,
  //       redirect: false, // Prevent automatic redirection
  //     });

  //     if (!result.error) {
  //       // Successful login
  //       console.log("Session:", result.session);
  //       window.location.href = "/login/success/"; // Redirect to the protected page
  //     } else {
  //       // Handle login error
  //       console.log("Login error:", result.error);
  //       window.location.href = "/login-failed"; // Redirect to the protected page
  //     }
  //   } else {
  //     console.log("Login Gagal");
  //   }
  // };

  if (status === "loading") {
    return <Loading />;
  } else if (status === "authenticated") {
    displayLogin = "";
    if (role === "mahasiswa") {
      router.push("/mahasiswa/dashboard");
    } else {
      router.push("/dosen/dashboard");
    }
  } else {
    displayLogin = (
      <>
        <div className="h-full w-full flex ">
          <div className="absolute -z-10 bg-fixed bg-cover w-screen h-screen bg-bottom bg-[url(/images/Kampus2Depan.jpeg)]"></div>
          <div className="h-screen relative z-0 w-full bg-primaryColor bg-opacity-85 md:bg-opacity-90">
            <div className="pl-9 pt-8">
              <picture>
                <img
                  src="https://uinsgd.ac.id/wp-content/uploads/2019/12/Logo-UIN-Putih.png"
                  alt="Logo UIN"
                  className="w-14 md:w-20"
                />
              </picture>
            </div>
            <div className="hidden md:inline-block pl-11 pt-8 md:w-44 lg:w-56 xl:w-96 font-darkerGrotesque font-bold md:text-xl lg:text-2xl text-white">
              <p>Silahkan Login</p>
              <p>Mahasiswa menggunakan SALAM</p>
              <p>Dosen menggunakan SIP</p>
            </div>
          </div>
          <div className="absolute md:hidden z-50 top-7 left-28 font-darkerGrotesque font-bold text-xl text-white">
            <p>Silahkan Login</p>
            <p>Mahasiswa menggunakan SALAM</p>
            <p>Dosen menggunakan SIP</p>
          </div>

          <div className="relative md:absolute h-5/6 lg:h-[97%] rounded-bl-2xl w-full md:w-3/4 right-0 z-10 bg-primaryColor bg-opacity-85 md:bg-opacity-100 md:bg-white">
            <div className="relative translate-x-[-100px] z-[999] flex flex-col items-center justify-center min-h-screen overflow-auto">
              <div className="bg-white p-5 rounded-lg drop-shadow-lg md:drop-shadow-none">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2 w-full">
                  Login
                </h1>
                {/* <div>
                <button
                  href="/login/mahasiswa"
                  style={{
                    backgroundColor:
                      userType === "mahasiswa" ? "#85997D" : "initial",
                    color: "black",
                    padding: "5px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    outline: "none",
                    marginRight: "10px",
                  }}
                  className=" hover:bg-[#85997D] text-xs md:text-sm"
                  onClick={(handleClick) => handleUserTypeChange("mahasiswa")}
                >
                  MAHASISWA
                </button>
                /
                <button
                  href="/login/dosen"
                  style={{
                    backgroundColor:
                      userType === "dosen" ? "#85997D" : "initial",
                    color: "black",
                    padding: "5px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    outline: "none",
                    marginLeft: "10px",
                  }}
                  className=" hover:bg-[#85997D] text-xs md:text-sm"
                  onClick={(handleClick) => handleUserTypeChange("dosen")}
                >
                  DOSEN
                </button>
              </div> */}

                {userType === "mahasiswa" ? (
                  <>
                    <form
                      className="mt-6"
                      onSubmit={(e) => handleSubmit(e, handleLogin)}
                    >
                      {" "}
                      {/*form mahasiswa*/}
                      <div className="mb-4">
                        <label
                          htmlFor="username"
                          className="block text-xs md:text-sm lg:text-base font-semibold text-gray-800"
                        >
                          Username
                        </label>
                        <div className="relative">
                          <div className="w-full">
                            <input
                              // required
                              id="username"
                              type="text"
                              placeholder="Username"
                              name="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="block text-xs md:text-sm lg:text-base w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 focus:bg-gray-50 border rounded-md focus:border-inputHoverColor focus:ring-inputHoverColor focus:outline-none focus:ring focus:ring-opacity-40"
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
                          className="block text-xs md:text-sm lg:text-base font-semibold text-gray-800"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <div className="w-full">
                            <input
                              // required
                              id="password"
                              type={open === false ? "password" : "text"}
                              placeholder="Enter Your Password"
                              name="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="block text-xs md:text-sm lg:text-base w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 focus:bg-gray-50 border rounded-md focus:border-inputHoverColor focus:ring-inputHoverColor focus:outline-none focus:ring focus:ring-opacity-40"
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
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        Forgot Password?
                      </Link>
                      <div className="mt-2">
                        <button className="w-full text-sm md:text-base px-4 py-2 tracking-wide text-white font-bold transition-colors duration-200 transform bg-inputColor border-inputColor rounded-md hover:bg-white hover:text-inputColor border">
                          Login
                        </button>
                      </div>
                    </form>

                    <div className="mt-4 text-sm md:text-base font-medium text-gray-800 text-center">
                      <span>Bukan Mahasiswa UIN Bandung? </span>
                      <Link
                        href="/create-account/identitas"
                        className="text-sm md:text-base text-blue-600 hover:underline font-bold"
                      >
                        Create Account
                      </Link>
                    </div>
                  </>
                ) : (
                  <form className="mt-6 xl:w-1/5 " onSubmit={handleLoginDosen}>
                    {" "}
                    {/* form dosen */}
                    <div className="mb-4">
                      <label
                        htmlFor="username"
                        className="block text-xs md:text-sm lg:text-base font-semibold text-gray-800"
                      >
                        Username
                      </label>
                      <div className="relative">
                        <div className="w-full">
                          <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block text-xs md:text-sm lg:text-base w-full px-4 py-2 mt-2 text-gray-700 bg-[#D9D9D9] border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                          />
                        </div>
                        <div className="text-sm absolute top-3 right-2">
                          <FaUser />
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="password"
                        className="block text-xs md:text-sm lg:text-base font-semibold text-gray-800"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div className="w-full">
                          <input
                            id="password"
                            type={open === true ? "password" : "text"}
                            placeholder="Enter Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block text-xs md:text-sm lg:text-base w-full px-4 py-2 mt-2 text-gray-700 bg-[#D9D9D9] border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                          />
                        </div>
                        {/* <input
                        type="hidden"
                        value={token}
                        className="block text-xs md:text-sm lg:text-base w-full px-4 py-2 mt-2 text-gray-700 bg-[#D9D9D9] border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                      /> */}

                        <div className="text-sm absolute top-3 right-2">
                          {open === false ? (
                            <FaEyeSlash onClick={FaToggle} />
                          ) : (
                            <FaEye onClick={FaToggle} />
                          )}
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Forget Password?
                    </Link>
                    <div className="mt-2">
                      <button className="w-full text-sm md:text-base px-4 py-2 tracking-wide text-[#000000] font-bold transition-colors duration-200 transform bg-IjoRumput rounded-md hover:bg-[#8FBB63] focus:outline-none focus:bg-[#8FBB63]">
                        Login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="fixed bottom-32 md:top-0 md:absolute z-10 md:translate-x-20 lg:translate-x-32">
            <Image
              src={MyImage}
              alt=""
              className="w-40 md:w-80 xl:w-[530px] xl:h-[450px] md:-translate-x-36 lg:-translate-x-9 md:translate-y-[420px] lg:translate-y-[370px] xl:translate-y-[245px] hidden lg:block"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <meta property="og:title" content="Login" key="title" />
      </Head>
      {displayLogin}
      <ErrorModal
        isOpen={isModal}
        onClose={handleCloseModal}
        isMessage={"Silahkan Isi Username dan Password Dahulu"}
        isTitle={"Login Error"}
      />
    </>
  );
}
