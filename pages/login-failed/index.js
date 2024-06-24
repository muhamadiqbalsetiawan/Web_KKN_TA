import Image from "next/image";
import MyImage from "../../public/images/fail.svg";
import Link from "next/link";
import Head from "next/head";
import Copyright from "@/components/copyright";

const loginFailed = () => {
  return (
    <>
      <Head>
        <title>Login Gagal</title>
        <meta property="og:title" content="Login Gagal" key="title" />
      </Head>
      <div className="grid justify-items-center py-16">
        <div className="bg-rose-500 rounded-md py-2 px-5 shadow-lg text-white">
          <h4 className="font-bold">LOGIN GAGAL !!!</h4>
          <h4>Username/Password tidak cocok</h4>
        </div>
        <Image src={MyImage} alt="image" className="w-[550px] p-10" />
        <div className="py-7">
          <Link
            href="/login"
            className="bg-inputColor hover:bg-inputHoverColor px-7 py-2 rounded-md font-bold text-2xl text-white"
          >
            Kembali
          </Link>
        </div>
      </div>

      <footer>
        <Copyright />
      </footer>
    </>
  );
};

export default loginFailed;
