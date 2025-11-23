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
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TableEmployeesProps {
  searchTerm: string;
  filters: {
    rol: string;
    activo: string;
  };
  sortDirection: "" | "asc" | "desc";
}

export function TableEmployees({
  searchTerm,
  filters,
  sortDirection,
}: TableEmployeesProps) {
  const [employees, setEmployees] = useState<Empleado[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Empleado | null>(null);
  const [editData, setEditData] = useState<Empleado | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const FUSE_OPTIONS = {
    keys: ["nombre", "apellido_p", "apellido_m", "rol", "telefono", "email"],
    threshold: 0.4,
  };

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

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch(`${API_URL}/empleados`);
        const data: Empleado[] = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    }
    fetchEmployees();
  }, []);

  const openEditModal = (emp: Empleado) => {
    setSelectedEmployee(emp);
    setEditData({ ...emp }); // Copia editable
    setOpenModal(true);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX");
  };

  return (
    <>
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
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredEmployees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{emp.id}</TableCell>
              <TableCell>
                {emp.nombre} {emp.apellido_p} {emp.apellido_m}
              </TableCell>
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
              <TableCell className="text-center">
                <button
                  onClick={() => openEditModal(emp)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* MODAL EDITABLE */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
          </DialogHeader>

          {editData && (
            <div className="space-y-4 mt-2">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={editData.nombre}
                  onChange={(e) =>
                    setEditData({ ...editData, nombre: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Apellido Paterno</Label>
                <Input
                  value={editData.apellido_p}
                  onChange={(e) =>
                    setEditData({ ...editData, apellido_p: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Apellido Materno</Label>
                <Input
                  value={editData.apellido_m ?? ""}
                  onChange={(e) =>
                    setEditData({ ...editData, apellido_m: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Rol</Label>
                <Input
                  value={editData.rol}
                  onChange={(e) =>
                    setEditData({ ...editData, rol: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Teléfono</Label>
                <Input
                  value={editData.telefono ?? ""}
                  onChange={(e) =>
                    setEditData({ ...editData, telefono: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={editData.email ?? ""}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Activo</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Switch
                    checked={editData.activo ?? false}
                    onCheckedChange={(val) =>
                      setEditData({ ...editData, activo: val })
                    }
                  />
                  <span>{editData.activo ? "Activo" : "Inactivo"}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}