'use client'
import {
  Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,
} from "@/components/ui/table"
import { useEffect,useState } from "react"

export function TableSales() {
    const [sales, setSales] = useState([]);
    useEffect(() =>{
        async function fetchSalesData(){
            try{
                const response = await fetch("https://back-tenis-proyect.onrender.com/ventas");
                const data = await response.json();
                console.log("Fetched sales data:", data);
                setSales(data);
            }catch (error) {
                console.error("Error fetching sales data:", error);
            }
        }
        fetchSalesData();
    },[]);


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
            <TableCell>{venta.fecha}</TableCell>
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
