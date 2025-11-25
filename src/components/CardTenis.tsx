import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";

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
  const marcaLower = marca?.toLowerCase() || "";
  const imgRef = useRef<HTMLImageElement>(null);
  const [backgroundColor, setBackgroundColor] = useState(
    rgb || "rgba(200, 200, 200, 0.3)"
  );

  useEffect(() => {
    if (rgb) {
      setBackgroundColor(rgb);
      return;
    }

    const img = imgRef.current;
    if (!img) return;

    const colorThief = new ColorThief();

    const extractColor = () => {
      try {
        // Obtener paleta de colores en lugar de solo el dominante
        const palette = colorThief.getPalette(img, 5);

        // Filtrar colores muy claros (blancos/grises) y muy oscuros
        const validColors = palette.filter(([r, g, b]) => {
          const brightness = (r + g + b) / 3;
          const saturation = Math.max(r, g, b) - Math.min(r, g, b);

          // Excluir colores muy claros (>220) o con poca saturación
          return brightness < 220 && saturation > 30;
        });

        // Si hay colores válidos, usar el primero; si no, usar el dominante original
        const selectedColor =
          validColors.length > 0 ? validColors[0] : palette[0];

        const rgbColor = `rgba(${selectedColor[0]}, ${selectedColor[1]}, ${selectedColor[2]}, 0.3)`;
        setBackgroundColor(rgbColor);
      } catch (error) {
        console.error("Error extracting color:", error);
      }
    };

    if (img.complete) {
      extractColor();
    } else {
      img.addEventListener("load", extractColor);
      return () => img.removeEventListener("load", extractColor);
    }
  }, [url_imagen, rgb]);

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
        className="absolute -top-[209px] -left-[218px]  rounded-full  w-[523px] aspect-square"
        style={{ background: backgroundColor }}
      ></div>
      <img
        ref={imgRef}
        src={url_imagen}
        alt={nombre}
        className="absolute w-[500px] h-[500px] -top-40 z-10 -rotate-15 -left-3 object-contain"
        crossOrigin="anonymous"
      />
      <div className="pt-[238px] relative w-full flex flex-col gap-2 z-10">
        <div className="items-center w-full flex justify-center">
          <h3 className=" text-[#1A1A1A] text-[28px] italic font-extrabold">
          {nombre}
        </h3>
        </div>
        <div className=" z-10 flex flex-col items-end gap-2 px-2 w-full">
          <p className=" text-black  text-xl font-light leading-normal">
            Color: {color}
          </p>
          <span className="text-2xl font-bold">${costo}</span>
        </div>
      </div>
      <p
        className={cn(
          "absolute z-5 text-[#1A1A1A]/60 text-center font-extrabold italic",
          // Tamaño de fuente según marca
          marcaLower === "nike"
            ? "text-[124px]"
            : marcaLower === "joma"
            ? "text-[110px]"
            : marcaLower === "adidas"
            ? "text-[82px]"
            : marcaLower === "puma"
            ? "text-[98px]"
            : marcaLower === "reebok"
            ? "text-[76px]"
            : marcaLower === "under armour"
            ? "text-[60px]"
            : marcaLower === "new balance"
            ? "text-[65px]"
            : marcaLower === "skechers"
            ? "text-[58px]"
            : "text-[124px]",
          // Padding top según marca
          marcaLower === "adidas"
            ? "top-[140px]"
            : marcaLower === "puma"
            ? "top-[115px]"
            : marcaLower === "reebok"
            ? "top-[140px]"
            : marcaLower === "under armour"
            ? "top-[65px]"
            : marcaLower === "new balance"
            ? "top-[50px]"
            : marcaLower === "skechers"
            ? "top-[165px]"
            : "top-[97px]"
        )}
      >
        {marca}
      </p>
    </div>
  );
};

export default CardTenis;
