'use client'
import {
  Table,TableBody,TableCell,TableHead,TableHeader,TableRow,
} from "@/components/ui/table"
import { useEffect,useState } from "react"
import { API_URL } from "@/features/shared/api-url"

export function TableSales() {
    const [sales, setSales] = useState([]);
    useEffect(() =>{
        async function fetchSalesData(){
            try{
                const response = await fetch(`${API_URL}/ventas`);
                const data = await response.json();
                console.log("Fetched sales data:", data);
                setSales(data);
            }catch (error) {
                console.error("Error fetching sales data:", error);
            }
        }
        fetchSalesData();
    },[]);
    function formatDate(dateString:string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Folio</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Pago</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Empleado</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((venta: any) => (
          <TableRow key={venta.id}>
            <TableCell>{venta.id}</TableCell>
            <TableCell>{formatDate(venta.fecha)}</TableCell>
            <TableCell>{venta.tipo_pago}</TableCell>
            <TableCell>{venta.total}</TableCell>
            <TableCell>{venta.clientes.nombres}</TableCell>
            <TableCell>{venta.empleados.nombre}</TableCell>
            <TableCell>${venta.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
