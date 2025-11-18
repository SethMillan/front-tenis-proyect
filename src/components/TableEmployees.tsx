"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { API_URL } from "@/features/shared/api-url";
import { Empleado } from "@/types/types";
import { useFuseSearch } from "@/hooks/useFuseSearch";

interface TableEmployeesProps {
  searchTerm: string;
  filters: {
    rol: string;
    activo: string;
  };
  sortDirection: "" | "asc" | "desc";
}

export function TableEmployees({ searchTerm, filters, sortDirection }: TableEmployeesProps) {
  const [employees, setEmployees] = useState<Empleado[]>([]);

  // SEARCH CONFIG
  const FUSE_OPTIONS = {
    keys: [
      "nombre",
      "apellido_p",
      "apellido_m",
      "rol",
      "telefono",
      "email"
    ],
    threshold: 0.4,
  };

  // APLICAR BUSQUEDA + FILTROS + ORDENADO
  const filteredEmployees = useFuseSearch(employees, searchTerm, FUSE_OPTIONS)
    .filter((emp) => {
      const matchesRol =
        !filters.rol || filters.rol === "todos" || emp.rol === filters.rol;

      const matchesActivo =
        !filters.activo ||
        filters.activo === "todos" ||
        (filters.activo === "activos" && emp.activo) ||
        (filters.activo === "inactivos" && !emp.activo);

      return matchesRol && matchesActivo;
    })
    .sort((a, b) => {
      if (!sortDirection) return 0;

      const dateA = new Date(a.created_at ?? "").getTime();
      const dateB = new Date(b.created_at ?? "").getTime();

      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

  // OBTENER DATOS DE API
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch(`${API_URL}/empleados`);
        const data: Empleado[] = await response.json();
        console.log("Fetched employees:", data);
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    }
    fetchEmployees();
  }, []);

  // FORMATEAR NOMBRE COMPLETO
  const formatFullName = (emp: Empleado) =>
    `${emp.nombre} ${emp.apellido_p} ${emp.apellido_m ?? ""}`.trim();

  // FORMATEAR FECHA
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Activo</TableHead>
          <TableHead>Fecha Alta</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredEmployees.map((emp) => (
          <TableRow key={emp.id}>
            <TableCell>{emp.id}</TableCell>
            <TableCell>{formatFullName(emp)}</TableCell>
            <TableCell>{emp.rol}</TableCell>
            <TableCell>{emp.telefono ?? "—"}</TableCell>
            <TableCell>{emp.email ?? "—"}</TableCell>
            <TableCell>
              {emp.activo ? (
                <span className="text-green-600 font-semibold">Activo</span>
              ) : (
                <span className="text-red-600 font-semibold">Inactivo</span>
              )}
            </TableCell>
            <TableCell>{formatDate(emp.created_at as any)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
