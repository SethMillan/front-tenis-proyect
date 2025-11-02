import React from "react";

type Props = {
  nombre: string;
  color: string;
  categoria: string;
  marca: string;
  url_imagen: string;
};

const CardTenis = ({ nombre, color, categoria, marca, url_imagen }: Props) => {
  return (
    <div className="border border-black border-solid flex w-[279px] h-[463px] rounded-4xl p-4 flex-col items-center gap-4 overflow-hidden">
      <div>
        <div className="rounded-full bg-amber-800 w-[523px] aspect-square right-2"></div>
      </div>
    </div>
  );
};

export default CardTenis;
