"use client";
import { Button } from "@/components/ui/button";
import { Filter, List, Search } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { TableSales } from "@/components/index";
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
} from "@/components/ui/select";
import { date } from "zod";

const pageSales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    tipoVenta: "",
    tipoPago: "",
    dateFrom: "",
    dateTo: "",
  });
  const [sortDirection, setSortDirection] = useState<"" | "asc" | "desc">("");

  return (
    <>
      <div className="pt-1 h-full w-full flex flex-col gap-10 justify-center items-start m-8">
        <h1 className="text-2xl font-bold">Ventas</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 w-lvh">
            <Input
              placeholder="Buscar ventas"
              className="pl-10"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, tipoVenta: value }))
                      }
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
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, tipoPago: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="Transferencia">
                        Transferencia
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="dateFrom">Fecha desde</label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateFrom: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="dateTo">Fecha hasta</label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateTo: e.target.value,
                      }))
                    }
                  />
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
              <div className="grid gap-2 py-2">
                <Button
                  variant={sortDirection === "desc" ? "default" : "outline"}
                  onClick={() => setSortDirection("desc")}
                >
                  Ventas más recientes
                </Button>
                <Button
                  variant={sortDirection === "asc" ? "default" : "outline"}
                  onClick={() => setSortDirection("asc")}
                >
                  Ventas más antiguas
                </Button>

                <Button variant="ghost" onClick={() => setSortDirection("")}>
                  Limpiar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <TableSales
          searchTerm={searchTerm}
          filters={filters}
          sortDirection={sortDirection}
        />
      </div>
    </>
  );
};

export default pageSales;
