"use client";
import React, { useEffect, useState } from "react";
import CardTenis from "../../../components/CardTenis";
import { Input } from "@/components/ui/input";
import { useFuseSearch } from "@/hooks/useFuseSearch";
import { fetchTenis } from "@/lib/api";
import { Producto } from "@/types/types";
import { useTenis } from "@/hooks/useAPI";
import { Filter, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// las opciones de FuseJS para la busqueda
const FUSE_OPTIONS = {
  keys: ["nombre", "marca"],
  threshold: 0.4,
};

const Page = () => {
  const {tenis, isLoading, isError} = useTenis();
  const [search, setSearch] = useState("");
  const resultados = useFuseSearch<Producto>(tenis || [], search, FUSE_OPTIONS);

  //! antes estaba asi
  // const [producto, setProducto] = useState<Producto[]>([]);
  // const [search, setSearch] = useState("");
  // useEffect(() => {
  //   async function loadTenis() {
  //     try {
  //       const data = await fetchTenis();
  //       setProducto(data);
  //     } catch (err) {
  //       console.error("Error fetching tenis data:", err);
  //     }
  //   }
  //   loadTenis();
  // }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando productos...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error al cargar los productos</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-24 flex flex-col relative">
        <div className="flex items-center gap-2 p-10">
          <div className="relative flex-1 w-lvh">
            <Input
              placeholder="Buscar productos"
              className="pl-10"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <List className="h-4 w-4" /> Ordenar
          </Button>
        </div>
        <div className="pt-1  flex flex-col gap-10 justify-center items-start m-8">
          <div className="flex gap-4 justify-center flex-wrap items-center content-center h-full ">
            {resultados.map((producto) => (
              <CardTenis
                key={producto.id}
                nombre={producto.nombre}
                color={producto.color}
                categoria={producto.categorias.nombre}
                marca={producto.marcas.nombre}
                costo={producto.inventarios[0]?.precio_venta || "0"}
                url_imagen={
                  producto.imagenes_productos?.[0]?.url || "default-image.png"
                }
                rgb={""} // ← Función helper
              />
            ))}
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
