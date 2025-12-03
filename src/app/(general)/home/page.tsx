"use client";
import React, { useEffect, useMemo, useState } from "react";
import CardTenis from "../../../components/CardTenis";
import { Input } from "@/components/ui/input";
import { useFuseSearch } from "@/hooks/useFuseSearch";
import { fetchTenis } from "@/lib/api";
import { Producto } from "@/types/types";
import { useInventario, useMarcas, useTenis } from "@/hooks/useAPI";
import { Filter, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// las opciones de FuseJS para la busqueda
const FUSE_OPTIONS = {
  keys: ["nombre", "marca"],
  threshold: 0.4,
};

const Page = () => {
  const { tenis, isLoading, isError } = useTenis();
  const [search, setSearch] = useState("");
  const {inventario = []} = useInventario();
  const { marcas = [] } = useMarcas();

  const [showPanel, setShowPanel] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState<number | null>(null); // <- Tambien planeo agregar varias marcas seleccionadas, quiza con un array pero se podra?
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null); // <- Planeo agregar filtro de color
  const resultados = useFuseSearch<Producto>(tenis || [], search, FUSE_OPTIONS);


  //?normalmente hariamos algo como esto para obtener las tallas
  //?pero gasta muchos recursos, hace el calculo cada que se renderiza el componente
  //const tallasDisponibles = [...new Set(inventario.filter((item) => item.cantidad > 0).map((item) => item.talla))]
  //?por eso usamos useMemo para memorizar el resultado y solo recalcularlo cuando inventario cambie
  //! recibe dos argumentos, una funcion que retorna el valor a memorizar y un array de dependencias
  //!el valor se recalcula solo cuando alguna dependencia cambia
  const tallasDisponibles = useMemo(() =>{
    return [...new Set(inventario.filter((item) => item.cantidad>0).map((item)=> item.talla))]
  }, [inventario]);


  // como ahora filtramos por marca y talla ya no podemos hacer esto, usaremos otro useMemo
  // var filteredResults = selectedMarca?resultados.filter((producto) => producto.marcas.id === selectedMarca ): resultados;
  const filteredResults  = useMemo(()=>{
    let filtered = resultados;
    if(selectedMarca){
      filtered =filtered.filter((item)=> item.marcas.id === selectedMarca);
    }
    if(selectedTalla){
      filtered = filtered.filter((item) => item.inventarios.some((inv) => inv.talla === selectedTalla))
    }
    return filtered;
  },[resultados, selectedMarca,selectedTalla]);

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
      {/* Contenedor principal ocupa toda la pantalla */}
      <div className="flex h-screen w-full">
        <div className="flex flex-col relative flex-1 overflow-y-auto">
          {/* Barra de busqueda y filtros */}
          <div className=" flex items-start gap-2 p-10 flex-col">
            <div className="flex items-center justify-between w-full">
              <h1 id="titulo" className="text-3xl font-bold">
                PRODUCTOS
              </h1>
              <Button
                onClick={() => setShowPanel(!showPanel)}
                variant="ghost"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
              </Button>
            </div>
            <div id="buscador" className="flex relative w-full">
              <Input
                placeholder="Buscar productos"
                className="pl-10"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex justify-between w-full ">
            <div className="flex gap-2">
              
              {marcas.map((marca) => (
                <Button
                  key={marca.id}
                  variant={selectedMarca === marca.id ? "default" : "secondary"} // ← cambiar variant si está seleccionado
                  onClick={() => setSelectedMarca(selectedMarca === marca.id ? null : marca.id)} // ← toggle
                  className="flex items-center gap-2"
                >
                  {marca.nombre}
                </Button>
              ))}
              </div>
             <Select
              value={selectedTalla || ""}  // ← Conecta con el estado
              onValueChange={(value) => setSelectedTalla(value || null)}  // ← Maneja el cambio
             >
                <SelectTrigger className="w-40 bg-amber-300">
                  <SelectValue placeholder="Filtrar tallas" />
                </SelectTrigger>
                <SelectContent>
                  {tallasDisponibles.map((talla,index)=>(
                    <SelectItem   key={index} value={talla}
                    onSelect={() => setSelectedTalla(talla === selectedTalla ? null : talla)}
                    >{talla}</SelectItem>
                  )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contenedor de productos */}
          <div className="pt-1 flex flex-col gap-10 justify-start items-start m-8">
            <div className="flex gap-4 justify-center flex-wrap items-start content-start">
              {filteredResults.map((producto) => (
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
                  rgb={""}
                />
              ))}
            </div>
          </div>
        </div>

        {showPanel && (
          <div className="w-[25%] bg-gray-100 p-8 border-l">
            <h1 className="text-2xl font-semibold">Detalles de Venta</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
