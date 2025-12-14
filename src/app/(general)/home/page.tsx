"use client";
import React, { useEffect, useMemo, useState } from "react";
import CardTenis from "../../../components/CardTenis";
import { Input } from "@/components/ui/input";
import { useFuseSearch } from "@/hooks/useFuseSearch";
import { fetchTenis } from "@/lib/api";
import { Producto } from "@/types/types";
import { useInventario, useMarcas, useTenis } from "@/hooks/useAPI";
import { createVenta } from "@/lib/api";
import { mutate } from "swr";
import { Filter, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PickVariantDialog from "@/components/PickVariantDialog";

// las opciones de FuseJS para la busqueda
const FUSE_OPTIONS = {
  keys: ["nombre", "marca"],
  threshold: 0.4,
};

const Page = () => {
  const { tenis = [], isLoading, isError } = useTenis();
  const [search, setSearch] = useState("");
  const { inventario = [] } = useInventario();
  const { marcas = [] } = useMarcas();

  const [showPanel, setShowPanel] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState<number | null>(null); // <- Tambien planeo agregar varias marcas seleccionadas, quiza con un array pero se podra?
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null); // <- Planeo agregar filtro de color
  const resultados = useFuseSearch<Producto>(tenis || [], search, FUSE_OPTIONS);

  // ventas / detalle de venta
  type SaleItem = {
    productoId: number;
    inventarioId: number;
    nombre: string;
    talla: string;
    color: string;
    qty: number;
    precio: number;
    url?: string;
  };
  const [saleDetails, setSaleDetails] = useState<SaleItem[]>([]);

  // modal para elegir talla/color cuando se selecciona un producto
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isPickOpen, setIsPickOpen] = useState(false);

  //?normalmente hariamos algo como esto para obtener las tallas
  //?pero gasta muchos recursos, hace el calculo cada que se renderiza el componente
  //const tallasDisponibles = [...new Set(inventario.filter((item) => item.cantidad > 0).map((item) => item.talla))]
  //?por eso usamos useMemo para memorizar el resultado y solo recalcularlo cuando inventario cambie
  //! recibe dos argumentos, una funcion que retorna el valor a memorizar y un array de dependencias
  //!el valor se recalcula solo cuando alguna dependencia cambia
  const tallasDisponibles = useMemo(() => {
    return [
      ...new Set(
        inventario.filter((item) => item.cantidad > 0).map((item) => item.talla)
      ),
    ];
  }, [inventario]);
  const coloresDisponibles = useMemo(() => {
    return [...new Set(tenis.map((item) => item.color))];
  }, [tenis]);

  console.log(coloresDisponibles);

  // como ahora filtramos por marca y talla ya no podemos hacer esto, usaremos otro useMemo
  // var filteredResults = selectedMarca?resultados.filter((producto) => producto.marcas.id === selectedMarca ): resultados;
  const filteredResults = useMemo(() => {
    let filtered = resultados;
    //!podriamos usar esto pero creo que seria mejor si ponemos algo como "producto no disponible" o algo asi
    //filtered = filtered.filter((item) => item.inventarios.some((inv)=>inv.cantidad>0));
    if (selectedMarca) {
      filtered = filtered.filter((item) => item.marcas.id === selectedMarca);
    }
    if (selectedTalla) {
      filtered = filtered.filter((item) =>
        item.inventarios.some((inv) => inv.talla === selectedTalla)
      );
    }
    if (selectedColor) {
      filtered = filtered.filter((item) => item.color === selectedColor);
    }
    return filtered;
  }, [resultados, selectedMarca, selectedTalla, selectedColor]);

  // abrir modal para seleccionar talla/color y cantidad
  function openVariantDialog(product: Producto) {
    setSelectedProduct(product);
    setIsPickOpen(true);
  }

  // calcular cantidad ya reservada en el detalle para una misma inventario
  function reservedQtyForInventory(inventarioId: number) {
    return saleDetails.reduce(
      (acc, cur) => acc + (cur.inventarioId === inventarioId ? cur.qty : 0),
      0
    );
  }

  // agregar item al detalle de venta con validacion de stock
  function handleAddToSale(item: SaleItem) {
    const producto = tenis.find((t) => t.id === item.productoId);
    const inventario = producto?.inventarios?.find(
      (i) => i.id === item.inventarioId
    );
    if (!inventario) {
      alert("Inventario no encontrado");
      return;
    }
    const alreadyReserved = reservedQtyForInventory(inventario.id);
    if (alreadyReserved + item.qty > inventario.cantidad) {
      alert("No hay suficiente stock para agregar esa cantidad");
      return;
    }

    setSaleDetails((prev) => {
      const existIndex = prev.findIndex(
        (p) => p.inventarioId === item.inventarioId
      );
      if (existIndex >= 0) {
        const copy = [...prev];
        copy[existIndex] = {
          ...copy[existIndex],
          qty: copy[existIndex].qty + item.qty,
        };
        return copy;
      }
      return [...prev, item];
    });
  }

  function removeSaleItem(inventarioId: number) {
    setSaleDetails((prev) =>
      prev.filter((p) => p.inventarioId !== inventarioId)
    );
  }

  function updateSaleItemQty(inventarioId: number, newQty: number) {
    // encontrar inventario y validar
    let inv: any = null;
    for (const p of tenis) {
      const found = p.inventarios.find((i) => i.id === inventarioId);
      if (found) {
        inv = found;
        break;
      }
    }
    if (!inv) return;
    const reservedExceptThis = saleDetails.reduce(
      (acc, cur) => acc + (cur.inventarioId === inventarioId ? 0 : cur.qty),
      0
    );
    if (reservedExceptThis + newQty > inv.cantidad) {
      alert("No hay suficiente stock para esa cantidad");
      return;
    }
    setSaleDetails((prev) =>
      prev.map((it) =>
        it.inventarioId === inventarioId ? { ...it, qty: newQty } : it
      )
    );
  }

  const [isClosing, setIsClosing] = useState(false);

  async function closeSale() {
  if (saleDetails.length === 0) {
    alert("No hay productos para cerrar la venta");
    return;
  }
  setIsClosing(true);

  const subtotal = saleDetails.reduce((s, it) => s + it.qty * it.precio, 0);
  const total = subtotal;

  const payload = {
  tipo_venta: "Presencial",
  tipo_pago: "Efectivo",
  empleado_id: 1,
  subtotal: parseFloat(subtotal.toFixed(2)),
  descuento: 0,
  total: parseFloat(total.toFixed(2)),
  detalles: saleDetails.map(item => ({
    inventario_id: item.inventarioId,
    cantidad: item.qty,
    total: parseFloat((item.qty * item.precio).toFixed(2))
  }))
};

  console.log("Payload con detalles:", JSON.stringify(payload, null, 2));

  try {
    const res = await createVenta(payload);
    mutate("/inventario");
    mutate("/productos");
    setSaleDetails([]);
    setShowPanel(false);
    alert(`Venta creada correctamente (id: ${res.id ?? "--"})`);
  } catch (err: any) {
    console.error("Error completo:", err);
    alert(err.message || "Error al crear la venta");
  } finally {
    setIsClosing(false);
  }
}

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
              <Button onClick={() => setShowPanel(!showPanel)} variant="ghost">
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
                    variant={
                      selectedMarca === marca.id ? "default" : "secondary"
                    } // ← cambiar variant si está seleccionado
                    onClick={() =>
                      setSelectedMarca(
                        selectedMarca === marca.id ? null : marca.id
                      )
                    } // ← toggle
                    className="flex items-center gap-2"
                  >
                    {marca.nombre}
                  </Button>
                ))}
              </div>
              <Select
                value={selectedTalla || ""}
                onValueChange={(value) =>
                  setSelectedTalla(value === "???" ? null : value)
                }
              >
                <SelectTrigger className="w-40 bg-amber-300">
                  <SelectValue placeholder="Filtrar tallas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="???">Todas</SelectItem>
                  {tallasDisponibles.map((talla, index) => (
                    <SelectItem key={index} value={talla}>
                      {talla}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedColor || ""}
                onValueChange={(value) =>
                  setSelectedColor(value === "???" ? null : value)
                } // aqui para que pueda poner todos
              >
                <SelectTrigger className="w-40 bg-amber-300">
                  <SelectValue placeholder="Filtrar color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="???">Todos</SelectItem>
                  {coloresDisponibles.map((color, index) => (
                    <SelectItem key={index} value={color}>
                      {color}
                    </SelectItem>
                  ))}
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
                  onClick={() => openVariantDialog(producto)}
                />
              ))}
            </div>
          </div>
        </div>

        {showPanel && (
          <div className="w-[25%] bg-gray-100 p-8 border-l">
            <h1 className="text-2xl font-semibold mb-4">Detalles de Venta</h1>
            <div className="flex flex-col gap-4">
              {saleDetails.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay productos en el detalle
                </p>
              )}
              {saleDetails.map((item) => (
                <div
                  key={item.inventarioId}
                  className="flex items-center justify-between gap-2 p-2 bg-white rounded-md"
                >
                  <div>
                    <p className="font-medium">{item.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.talla} • {item.color}
                    </p>
                    <p className="text-sm">
                      {item.qty} x ${item.precio}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 bg-gray-200 rounded"
                        onClick={() =>
                          updateSaleItemQty(
                            item.inventarioId,
                            Math.max(1, item.qty - 1)
                          )
                        }
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button
                        className="p-1 bg-gray-200 rounded"
                        onClick={() =>
                          updateSaleItemQty(item.inventarioId, item.qty + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold">
                      ${(item.qty * item.precio).toFixed(2)}
                    </p>
                    <button
                      className="text-sm text-red-600"
                      onClick={() => removeSaleItem(item.inventarioId)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

              {saleDetails.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="font-semibold">
                    Total: $
                    {saleDetails
                      .reduce((s, it) => s + it.qty * it.precio, 0)
                      .toFixed(2)}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSaleDetails([])}
                    >
                      Limpiar
                    </Button>
                    <Button onClick={closeSale} disabled={isClosing}>
                      {isClosing ? "Procesando..." : "Cerrar venta"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <PickVariantDialog
          product={selectedProduct}
          open={isPickOpen}
          onClose={() => setIsPickOpen(false)}
          onAdd={handleAddToSale}
          reservedForInventory={0}
        />
      </div>
    </>
  );
};

export default Page;
