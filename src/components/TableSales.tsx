'use client'
import {
  Table,TableBody,TableCell,TableHead,TableHeader,TableRow,
} from "@/components/ui/table"
import { Venta, Cliente, Empleado } from "@/types/types"
import { useFuseSearch } from "@/hooks/useFuseSearch"
import { useSales } from "@/hooks/useAPI"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { VentaDetalleDialog } from "./DialogSalesDetails"
interface TableSalesProps {
 searchTerm: string;
  filters: {
    tipoVenta: string;
    tipoPago: string;
    dateFrom?: string;
    dateTo?: string;
  };
  sortDirection : ""|"asc"|"desc";
}

export function TableSales({ searchTerm, filters, sortDirection }: TableSalesProps) {

  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { ventas = [], isLoading, isError } = useSales();

  const FUSE_OPTIONS = {
        keys: [
            "tipo_venta",
            "tipo_pago",
            "clientes.nombres",
            "clientes.apellido_p",
            "empleados.nombre",
            "empleados.apellido_p",
            "total"
        ],
        threshold: 0.4,
    };
  const filteredSales = useFuseSearch(ventas, searchTerm, FUSE_OPTIONS)
    .filter((venta) => {
      const matchesTipoVenta = !filters.tipoVenta  || filters.tipoVenta === "todos" || venta.tipo_venta === filters.tipoVenta;
      const matchesTipoPago = !filters.tipoPago ||  filters.tipoPago === "todos" || venta.tipo_pago === filters.tipoPago;
       //Filtros por fecha
       if (filters.dateFrom || filters.dateTo) {
        const ventaDate = new Date(venta.fecha);
        if (filters.dateFrom) {
          const from = new Date(filters.dateFrom + 'T00:00:00');
          if (ventaDate < from) return false;
        }
        if (filters.dateTo) {
          const to = new Date(filters.dateTo + 'T23:59:59.999');
          if (ventaDate > to) return false;
        }
      }
      
      return matchesTipoVenta && matchesTipoPago;
    })
    .sort((a, b) => {
      if (!sortDirection) return 0;
      const dateFrom = new Date(a.fecha).getTime();
      const dateTo = new Date(b.fecha).getTime();
      return sortDirection === "asc" ? dateFrom - dateTo : dateTo - dateFrom;
    });
    const handleRowClick = (venta:Venta) => {
      setSelectedVenta(venta);
      setDialogOpen(true);
    }

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 w-full">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Cargando ventas...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-8 w-full text-red-500">
        <p>Error al cargar las ventas</p>
      </div>
    );
  }

  function formatDate(dateString:string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
   const formatFullName = (person?: Cliente | Empleado | null) => {
      if (!person) return 'N/A';
      // Esta mal pero asi desde la bd, entonces veremos como lo cambiamos
      const first = ('nombres' in person) ? (person as Cliente).nombres : (person as Empleado).nombre;
      const apellidoP = person.apellido_p ?? '';
      const apellidoM = person.apellido_m ?? '';
      return `${first} ${apellidoP} ${apellidoM}`.trim();
    };

  return (
    <><Table>
      <TableHeader>
        <TableRow>
          <TableHead>Folio</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Tipo de pago</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Empleado</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredSales.length > 0 ? (
          filteredSales.map((venta) => (
            <TableRow key={venta.id}
              onClick={() => handleRowClick(venta)}
              className="cursor-pointer hover:bg-gray-100 transition-colors">
              <TableCell>{venta.id}</TableCell>
              <TableCell>{formatDate(venta.fecha)}</TableCell>
              <TableCell>{venta.tipo_pago}</TableCell>
              <TableCell>{venta.tipo_venta}</TableCell>
              <TableCell>{formatFullName(venta.clientes)}</TableCell>
              <TableCell>{formatFullName(venta.empleados)}</TableCell>
              <TableCell>${venta.total}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4 text-gray-500">
              No se encontraron ventas
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table><VentaDetalleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        venta={selectedVenta} /></>
  )
}
