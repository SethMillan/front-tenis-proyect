import Button from "@/components/Button";
import React from "react";

function page() {
  return (
    <div className="mt-[63px] mx-[115px] mb-[71px] ">
      <h1 className="text-[#1A1A1A] text-5xl font-normal text-center ">
        Iniciar Sesión
      </h1>
      <p className="text-[#1A1A1A] mt-[31px] text-center">
        Ingresa tus contraseñas para poder ingresar
      </p>
      <div className="mt-[52px]">
        <div className="text-[#1A1A1A] ">
          <p className="">Usuario</p>
          <input
            className="w-[527px] h-[65px] border border-[#E0E0E0]  rounded-[10px] mt-[10px] p-4"
            type="text"
            placeholder="Ingresa tu usuario"
          />
        </div>
        <p className="text-[#1A1A1A] mt-[30px]">Contraseña</p>
        <input
          className="w-[527px] h-[65px] border border-[#E0E0E0]  rounded-[10px] mt-[10px] p-4"
          type="password"
          placeholder="Ingresa tu contraseña"
        />
        <p className="text-[#3188FD] -mr-[17px] text-end text-[18px] underline-offset-auto underline cursor-pointer pt-[25px]">
          Olvidaste tu contraseña?
        </p>
      </div>
      <div className="flex items-center justify-center mt-[40px]">
        <Button />
      </div>
    </div>
  );
}

export default page;
