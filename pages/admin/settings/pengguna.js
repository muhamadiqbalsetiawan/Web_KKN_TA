import React, { useEffect, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Pengguna() {
  const [userType, setUserType] = useState("mahasiswa");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const [user, setUser] = useState(null);
  let displayAdmin = "";

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (!user) {
      router.push("/admin");
    }
    setUser(user);
  }, [router]);

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const [selectedButton, setSelectedButton] = useState(null);

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

  const handleLogin = async (e) => {
    e.preventDefault();

    // Attempt to sign in using the Credentials provider
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false, // Prevent automatic redirection
    });

    if (!result.error) {
      // Successful login
      console.log("Session:", result.session);
      window.location.href = "/mahasiswa/protected"; // Redirect to the protected page
    } else {
      // Handle login error
      console.error("Login error:", result.error);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  if (user === null) {
    displayAdmin = "";
  } else {
    displayAdmin = (
      <>
        <div className=" bg-primaryColor w-screen h-screen pl-32 py-4 flex items-start ">
          <picture>
            <img src="/nav-logo.png" alt="logo" className="w-[90px] " />
          </picture>
          <div className="flex justify-center items-center w-2/3 ml-16 mt-16">
            <div className="w-full">
              <div className="flex flex-col items-center justify-center overflow-hidden">
                <h1 className="text-3xl font-bold text-center text-gray-700 mb-4">
                  Create New Account
                </h1>
                <div>
                  <button
                    href="/login/mahasiswa"
                    style={{
                      backgroundColor:
                        userType === "mahasiswa" ? "#dde5d9" : "initial",
                      color: "black",
                      padding: "5px 16px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      outline: "none",
                      marginRight: "10px",
                    }}
                    className=" hover:bg-[#dde5d9]"
                    onClick={() => handleUserTypeChange("mahasiswa")}
                  >
                    MAHASISWA
                  </button>
                  /
                  <button
                    href="/login/dosen"
                    style={{
                      backgroundColor:
                        userType === "dosen" ? "#dde5d9" : "initial",
                      color: "black",
                      padding: "5px 16px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      outline: "none",
                      marginLeft: "10px",
                      marginRight: "10px",
                    }}
                    className=" hover:bg-[#dde5d9] "
                    onClick={() => handleUserTypeChange("dosen")}
                  >
                    DOSEN
                  </button>
                  /
                  <button
                    href="/login/admin"
                    style={{
                      backgroundColor:
                        userType === "admin" ? "#dde5d9" : "initial",
                      color: "black",
                      padding: "5px 16px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      outline: "none",
                      marginLeft: "10px",
                    }}
                    className=" hover:bg-[#dde5d9] "
                    onClick={() => handleUserTypeChange("admin")}
                  >
                    ADMIN
                  </button>
                </div>

                {/* Form yang bergantung pada userType */}
                <form className="mt-6 w-1/3" onSubmit={handleLogin}>
                  {userType === "mahasiswa" && (
                    <form>
                      {" "}
                      {/*form mahasiswa*/}
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
                              type="text"
                              placeholder="mahasiswa"
                              name="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-[#D9D9D9] border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                              type={open === false ? "password" : "text"}
                              placeholder="Enter Your Password"
                              name="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-[#D9D9D9] border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                    </form>
                  )}

                  {userType === "dosen" && (
                    <form>
                      {" "}
                      {/*form dosen*/}
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
                              type="text"
                              placeholder="dosen"
                              name="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-[#D9D9D9] border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                              type={open === false ? "password" : "text"}
                              placeholder="Enter Your Password"
                              name="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-[#D9D9D9] border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                    </form>
                  )}

                  {userType === "admin" && (
                    <form>
                      {" "}
                      {/*form admin*/}
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
                              type="text"
                              placeholder="admin"
                              name="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-[#D9D9D9] border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                              type={open === false ? "password" : "text"}
                              placeholder="Enter Your Password"
                              name="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-[#D9D9D9] border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
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
                    </form>
                  )}

                  {/* Tombol login umum */}
                  <div className="mt-6 flex justify-center items-center">
                    <button className="text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:outline-none focus:ring-IjoRumput font-bold rounded-lg text-sm px-5 py-2 text-center grid justify-center items-center">
                      New Account
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={goBack}
                  className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-2 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm px-5 py-2 text-center grid justify-center items-center"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{displayAdmin}</>;
}
