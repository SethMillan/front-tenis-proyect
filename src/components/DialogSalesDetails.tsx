"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Venta } from "@/types/types"
import { Separator } from "@/components/ui/separator"

interface VentaDetalleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venta: Venta | null
}

export function VentaDetalleDialog({ open, onOpenChange, venta }: VentaDetalleDialogProps) {
  if (!venta) return null

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const formatFullName = (person: any) => {
    if (!person) return 'No especificado';
    const first = ('nombres' in person) ? person.nombres : person.nombre;
    const apellidoP = person.apellido_p ?? '';
    const apellidoM = person.apellido_m ?? '';
    return `${first} ${apellidoP} ${apellidoM}`.trim();
  };

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(Number(value));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <DialogHeader>
          <div className="flex items-start justify-between pr-8">
            <div>
              <DialogTitle className="text-2xl">Detalle de Venta #{venta.id}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                {formatDate(venta.fecha)}
              </DialogDescription>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                venta.tipo_venta === 'Presencial' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {venta.tipo_venta}
              </span>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        {/* INFORMACIÓN GENERAL */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Sección Cliente */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Cliente</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <span className="text-gray-600">Nombre:</span>
                <br />
                <span className="font-medium">{formatFullName(venta.clientes)}</span>
              </p>
              {venta.clientes && (
                <>
                  <p className="text-sm">
                    <span className="text-gray-600">Email:</span>
                    <br />
                    <span className="font-medium text-blue-600">{venta.clientes.email}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Teléfono:</span>
                    <br />
                    <span className="font-medium">{venta.clientes.telefono}</span>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Sección Empleado y Pago */}
          <div className="space-y-3 ">
            <h3 className="font-semibold text-gray-900">Información de Venta</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-5">
              <p className="text-sm">
                <span className="text-gray-600">Empleado:</span>
                <br />
                <span className="font-medium">{formatFullName(venta.empleados)}</span>
              </p>
              <p className="text-sm ">
                <span className="text-gray-600">Tipo de Pago:</span>
                <br />
                <span className={`font-semibold inline-block px-2 py-1 rounded text-xs ${
                  venta.tipo_pago === 'Efectivo' ? 'bg-green-100 text-green-800' :
                  venta.tipo_pago === 'Tarjeta' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {venta.tipo_pago}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* TABLA DE PRODUCTOS */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 text-lg">Productos Vendidos</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Talla</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venta.detalleventas && venta.detalleventas.length > 0 ? (
                  venta.detalleventas.map((detalle) => (
                    <TableRow key={detalle.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {detalle.inventarios.productos.nombre}
                      </TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded text-sm" >
                          {detalle.inventarios.productos.color}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {detalle.inventarios.talla}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {detalle.cantidad}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(detalle.inventarios.precio_venta)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        {formatCurrency(detalle.total)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      Sin productos en esta venta
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Separator className="my-6" />

        {/* RESUMEN FINANCIERO */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(venta.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Descuento:</span>
              <span className="font-medium text-red-600">
                {Number(venta.descuento) > 0 ? '-' : ''}{formatCurrency(venta.descuento)}
              </span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between text-lg">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="font-bold text-green-600 text-xl">
                {formatCurrency(venta.total)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
