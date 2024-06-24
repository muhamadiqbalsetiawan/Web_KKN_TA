import Image from "next/image";
import StoriImage from "../../public/images/speker-logo.png";
import Link from "next/link";
import Head from "next/head";
import Copyright from "@/components/copyright";

const forgotPassword = () => {
  return (
    <>
      <Head>
        <title>Forgot Password</title>
        <meta property="og:title" content="Lupa Password" key="title" />
      </Head>
      <div className="h-screen flex justify-center py-9">
        <div className=" justify-between items-center">
          <div className="flex justify-center">
            <h1 className="font-bold text-3xl">
              SILAHKAN HUBUNGI ADMIN JURUSAN
            </h1>
          </div>

          <Image src={StoriImage} alt="tetxt" />

          {/* <div className="flex justify-center">
            <h1 className=" px-4 bg-primaryColor text-[#FFFFFF] justify-items-center font-bold ">
              082XXXXXXXXX
            </h1>
          </div> */}
          <div className="flex justify-center pt-5">
            <Link
              href="../login"
              className="bg-inputColor hover:bg-inputHoverColor justify-items-center font-bold text-white text-2xl px-6 py-2 rounded-lg"
            >
              Kembali
            </Link>
          </div>
        </div>
      </div>
      <footer>
        <Copyright />
      </footer>
    </>
  );
};

export default forgotPassword;
