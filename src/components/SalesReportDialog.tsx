"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Loader2 } from "lucide-react";
import { useSalesReportPDF } from "@/hooks/useAPI";

export function SalesReportDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { generateReport } = useSalesReportPDF();

  const handleGenerateReport = async () => {
    // Validar que ambas fechas estén seleccionadas
    if (!dateFrom || !dateTo) {
      setError("Por favor selecciona un rango de fechas válido");
      return;
    }

    // Validar que la fecha de inicio sea anterior a la de fin
    if (dateFrom > dateTo) {
      setError("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await generateReport(dateFrom, dateTo);
      // Cerrar el diálogo después de generar el reporte
      setIsOpen(false);
      // Limpiar los campos
      setDateFrom("");
      setDateTo("");
    } catch (err) {
      setError("Error al generar el reporte. Por favor intenta de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" /> Reporte
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generar Reporte de Ventas</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="dateFrom">Fecha desde</label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setError(null);
              }}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="dateTo">Fecha hasta</label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setError(null);
              }}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerateReport}
            disabled={isLoading || !dateFrom || !dateTo}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              "Generar Reporte"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
