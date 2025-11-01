import React from "react";
import CardTenis from "../components/CardTenis";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center content-center h-full ">
      <CardTenis
        nombre={""}
        color={""}
        categoria={""}
        marca={""}
        url_imagen={""}
      />
    </div>
  );
};

export default page;
