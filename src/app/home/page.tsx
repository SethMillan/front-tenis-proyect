import React from "react";
import CardTenis from "../components/CardTenis";

const page = () => {
  return (
    <>
      {/* aqui iria un buscador o algo asi */}
      <div className="pt-1 h-full w-full flex flex-col gap-10 justify-center items-start m-8">
        <div className="flex gap-4 justify-center flex-wrap items-center content-center h-full ">
          <CardTenis
            nombre={"Nike Pegasus 41"}
            color={"Celeste"}
            rgb={"#BDD6D9"}
            categoria={"Tenis de running"}
            marca={"NIKE"}
            url_imagen={"tenis_celeste.png"}
            costo={"1,799.00"}
          />
          <CardTenis
            nombre={"Nike Invincible 3"}
            color={"Celeste"}
            categoria={"Tenis de running"}
            marca={"NIKE"}
            rgb={"#858685"}
            url_imagen={"invinicble-3.png"}
            costo={"1,293.00"}
          />
          <CardTenis
            nombre={"Nike Vomero Plus"}
            color={"Rosa Viejo"}
            categoria={"Tenis de running"}
            marca={"NIKE"}
            rgb={"rgba(211, 163, 182, 0.60)"}
            url_imagen={"vomero-plus-5.png"}
            costo={"2,452.00"}
          />
          <CardTenis
            nombre={"Running R1000"}
            color={"Naranja"}
            categoria={"Tenis de running"}
            marca={"JOMA"}
            rgb={"rgba(251, 94, 28, 0.65)"}
            url_imagen={"joma-naranja.png"}
            costo={"1,799.00"}
          />
         <CardTenis
            nombre={"Running R2000"}
            color={"Naranja"}
            categoria={"Tenis de running"}
            marca={"ADIDAS"}
            rgb={"rgba(82, 65, 89, 0.60)"}
            url_imagen={"adidas-moradas.png"}
            costo={"1,799.00"}
          /><CardTenis
            nombre={"Nike Pegasus 41"}
            color={"Celeste"}
            rgb={"#BDD6D9"}
            categoria={"Tenis de running"}
            marca={"NIKE"}
            url_imagen={"tenis_celeste.png"}
            costo={"1,799.00"}
          />
          <CardTenis
            nombre={"Nike Invincible 3"}
            color={"Celeste"}
            categoria={"Tenis de running"}
            marca={"NIKE"}
            rgb={"#858685"}
            url_imagen={"invinicble-3.png"}
            costo={"1,293.00"}
          />
          <CardTenis
            nombre={"Nike Vomero Plus"}
            color={"Rosa Viejo"}
            categoria={"Tenis de running"}
            marca={"NIKE"}
            rgb={"rgba(211, 163, 182, 0.60)"}
            url_imagen={"vomero-plus-5.png"}
            costo={"2,452.00"}
          />
        </div>
      </div>
    </>
  );
};

export default page;
