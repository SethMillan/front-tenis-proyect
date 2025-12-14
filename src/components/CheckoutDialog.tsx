"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useClientes } from "@/hooks/useAPI";

type CheckoutDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    cliente_id: number | null;
    tipo_pago: string;
  }) => void;
  total: number;
  isProcessing: boolean;
  clientes: any[];
};

const CheckoutDialog = ({
  open,
  onClose,
  onConfirm,
  total,
  isProcessing,
  clientes
}: CheckoutDialogProps) => {
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [tipoPago, setTipoPago] = useState<string>("Efectivo");

  const handleConfirm = () => {
    onConfirm({
      cliente_id: clienteId,
      tipo_pago: tipoPago,
    });
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finalizar Venta</DialogTitle>
          <DialogDescription>
            Complete la información para procesar la venta
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
            <span className="text-lg font-semibold">Total a pagar:</span>
            <span className="text-2xl font-bold text-green-600">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Cliente */}
          <div className="grid gap-2">
            <Label htmlFor="cliente">Cliente (Opcional)</Label>
            <Select
              value={clienteId?.toString() || "ninguno"}
              onValueChange={(value) =>
                setClienteId(value === "ninguno" ? null : parseInt(value))
              }
            >
              <SelectTrigger id="cliente">
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ninguno">Sin cliente</SelectItem>
                {clientes
                  .filter((c) => c.activo)
                  .map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nombres} {cliente.apellido_p}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Pago */}
          <div className="grid gap-2">
            <Label htmlFor="tipoPago">Tipo de Pago</Label>
            <Select value={tipoPago} onValueChange={setTipoPago}>
              <SelectTrigger id="tipoPago">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Efectivo">Efectivo</SelectItem>
                <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                <SelectItem value="Transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing ? "Procesando..." : "Confirmar Venta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;