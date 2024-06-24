import React from "react";
import Exclamation from "./svgs/exclamation";

export default function Notify() {
  return (
    <div
      className="absolute py-2 px-4 bg-white lg:w-2/5 lg:top-7 rounded-lg flex flex-row items-center space-x-5 shadow-md"
    >
      <div>
        <Exclamation className="h-10 w-10 text-yellow-400" />
      </div>
      <div className="text-left text-sm">
        <h1 className="font-bold text-base">Silahkan Ajukan Ketua Kelompok</h1>
        <p>
          Bisa dilakukan dengan cara berunding, kemudian mengajukan dirinya
          sebagai ketua, Jika tidak mengajukan, akan ditentukan secara otomatis.
        </p>
      </div>
    </div>
  );
}
