"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Venta } from "@/types/types"

interface VentaDetalleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venta: Venta | null
}


export function VentaDetalleDialog({ open, onOpenChange, venta }: VentaDetalleDialogProps) {
  if (!venta) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalle de venta #{venta.id}</DialogTitle>
          <DialogDescription>
            Información completa de la transacción
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p><strong>Fecha:</strong> {venta.fecha}</p>
          <p><strong>Tipo:</strong> {venta.tipo_venta}</p>
          <p><strong>Tipo de pago:</strong> {venta.tipo_pago}</p>
          <p><strong>Cliente:</strong> {venta.clientes?.nombres}</p>
          <p><strong>Empleado:</strong> {venta.empleados.nombre}</p>
          <p><strong>Total:</strong> ${venta.total}</p>

          {/* Aquí puedes meter una tabla interna de productos vendidos */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
