import { Button } from "@/components/ui/button";
import { Filter, List, Search } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import { TableSales} from "@/app/components/TableSales";

const pageSales = () => {
  return (
    <>
      <div className="pt-1 h-full w-full flex flex-col gap-10 justify-center items-start m-8">
        <h1 className="text-2xl font-bold">Ventas</h1>
        <div className="flex items-center gap-2">
        <div className="relative flex-1 w-lvh">
           <Input placeholder="Buscar productos" className="pl-10" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /> 
        </div>
        <Button variant="outline" className="flex items-center gap-2">
           <Filter className="h-4 w-4" /> Filtros 
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <List className="h-4 w-4" /> Ordenar
        </Button>
      </div>
      <TableSales />

      </div>
    </>
  );
};

export default pageSales;