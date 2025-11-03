"use client"
import { Button } from "@/components/ui/button";
import { Filter, List, Search } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { TableSales} from "../../../components/TableSales";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Venta } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



const pageSales = () => {
   const [searchTerm, setSearchTerm] = useState("");
   const [filters, setFilters] = useState({
     tipoVenta: "",
     tipoPago: "",
     minTotal: "",
     maxTotal: "",
   });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Venta | "";
    direction: "asc" | "desc";
  }>({
    key: "",
    direction: "asc"
  });
  const handleSort = (key: keyof Venta) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
    }));
  };

  return (
    <>
      <div className="pt-1 h-full w-full flex flex-col gap-10 justify-center items-start m-8">
        <h1 className="text-2xl font-bold">Ventas</h1>
        <div className="flex items-center gap-2">
        <div className="relative flex-1 w-lvh">
           <Input 
            placeholder="Buscar ventas"
            className="pl-10"
            onChange={(e) => setSearchTerm(e.target.value)} />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /> 
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filtros
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtros de Ventas</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="tipoVenta">Tipo de Venta</label>
                  <Select
                    onValueChange={(value) => setFilters(prev => ({ ...prev, tipoVenta: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de venta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="Presencial">Presencial</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="tipoPago">Tipo de Pago</label>
                  <Select
                    onValueChange={(value) => setFilters(prev => ({ ...prev, tipoPago: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="Transferencia">Transferencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
          </DialogContent>
        </Dialog>
        {/*Boton de ordenar*/}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Ordenar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ordenar Ventas</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="sortBy">Ordenar por</label>
                <Select
                  onValueChange={(value) => handleSort(value as keyof Venta)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el criterio de orden" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total</SelectItem>
                    <SelectItem value="tipo_venta">Tipo de Venta</SelectItem>
                    <SelectItem value="tipo_pago">Tipo de Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <TableSales 
          searchTerm={searchTerm} 
          filters={filters}
          sortConfig={sortConfig}
        />
      </div>
    </>
  );
};

export default pageSales;