"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Producto, Inventario } from "@/types/types";

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

export default function PickVariantDialog({
  product,
  open,
  onClose,
  onAdd,
  reservedForInventory = 0,
}: {
  product: Producto | null;
  open: boolean;
  reservedForInventory?: number; 
  onClose: () => void;
  onAdd: (item: SaleItem) => void;
}) {
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);

  const inventarios: Inventario[] = product?.inventarios || [];

  const tallas = useMemo(() => {
    return inventarios.map((i) => i.talla);
  }, [inventarios]);

  React.useEffect(() => {
    setSelectedTalla((prev) => prev || (tallas[0] ?? null));
    setSelectedColor(product?.color ?? null);
    setQty(1);
  }, [product]);

  const selectedInventory = inventarios.find((i) => i.talla === selectedTalla);
  const available = (selectedInventory?.cantidad ?? 0) - reservedForInventory;

  function handleAdd() {
    if (!product || !selectedInventory) return;
    if (qty < 1) return;
    if (qty > available) {
      alert("No hay suficiente stock para esa talla.");
      return;
    }
    const precio = Number(selectedInventory.precio_venta || 0);
    onAdd({
      productoId: product.id,
      inventarioId: selectedInventory.id,
      nombre: product.nombre,
      talla: selectedInventory.talla,
      color: selectedColor || product.color,
      qty,
      precio,
      url: product.imagenes_productos?.[0]?.url,
    });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecciona talla y color</DialogTitle>
          <DialogDescription>
            Elige la talla, color y cantidad para agregar al detalle de venta.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div>
            <label className="text-sm font-medium">Talla</label>
            <Select
              value={selectedTalla ?? ""}
              onValueChange={(v) => setSelectedTalla(v || null)}
            >
              <SelectTrigger className="w-40 mt-2">
                <SelectValue placeholder="Selecciona talla" />
              </SelectTrigger>
              <SelectContent>
                {tallas.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedInventory && (
              <p className="text-sm text-muted-foreground mt-1">
                Disponibles: {selectedInventory.cantidad - reservedForInventory}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Color</label>
            <Select
              value={selectedColor ?? ""}
              onValueChange={(v) => setSelectedColor(v || null)}
            >
              <SelectTrigger className="w-40 mt-2">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={product?.color ?? ""}>
                  {product?.color ?? "-"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Cantidad</label>
            <Input
              className="w-24 mt-2"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAdd}>Agregar</Button>
        </DialogFooter>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
