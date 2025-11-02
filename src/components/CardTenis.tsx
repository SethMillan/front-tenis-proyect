import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  nombre: string;
  color: string;
  categoria: string;
  marca: string;
  url_imagen: string;
  costo: string;
  rgb?: string;
};

const CardTenis = ({
  nombre,
  color,
  categoria,
  marca,
  url_imagen,
  costo,
  rgb,
}: Props) => {
  return (
    <div
      className={cn(
        "relative border flex w-[279px] h-[406px] rounded-4xl p-4",
        "flex-col items-center gap-4 overflow-hidden",
        "transition-all duration-300 ease-in-out",
        "hover:scale-101 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      )}
    >
      {" "}
      <div
        className="absolute -top-[209px] -left-[218px]  rounded-full  w-[523px] aspect-square "
        style={{ background: rgb }}
      ></div>
      <img
        src={url_imagen}
        alt={nombre}
        className="absolute w-full top-0 z-10 -left-3"
      />
      <div className="pt-[238px] relative z-10 flex flex-col items-end gap-2">
        <h3 className="text-[#1A1A1A] text-[28px] italic font-extrabold leading-normal">
          {nombre}
        </h3>
        <p className=" text-black  text-xl font-light leading-normal">
          Color: {color}
        </p>
        <span className="text-2xl font-bold">${costo}</span>
      </div>
      <p
        className={cn(
          "absolute z-5 text-[#1A1A1A]/60 text-center font-extrabold italic",
          // Tamaño de fuente según marca
          marca.toLowerCase() === "nike"
            ? "text-[124px]"
            : marca.toLowerCase() === "joma"
            ? "text-[110px]"
            : marca.toLowerCase() === "adidas"
            ? "text-[82px]"
            : "text-[124px]",
          // Padding top según marca
          marca.toLowerCase() === "adidas" ? "top-[140px]" : "top-[97px]"
        )}
      >
        {marca}
      </p>
    </div>
  );
};

export default CardTenis;
