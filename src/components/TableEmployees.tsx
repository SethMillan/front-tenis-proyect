"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useState, useMemo } from "react";
import { useEmpleados } from "@/hooks/useAPI";

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
  const [editData, setEditData] = useState<Empleado | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const { empleados, isLoading, isError } = useEmpleados();

  const uniqueEmployees = useMemo(() => {
    if (!empleados) return [];
    const map = new Map<number, Empleado>();
    empleados.forEach((emp) => map.set(emp.id, emp));
    return Array.from(map.values());
  }, [empleados]);

  const FUSE_OPTIONS = useMemo(
    () => ({
      keys: ["nombre", "apellido_p", "apellido_m", "rol", "telefono", "email"],
      threshold: 0.4,
    }),
    []
  );

  const filteredEmployees = useFuseSearch(uniqueEmployees, searchTerm, FUSE_OPTIONS);

  const filteredByRol =
    filters.rol && filters.rol !== "todos"
      ? filteredEmployees.filter((e) => e.rol === filters.rol)
      : filteredEmployees;

  const filteredByEstado =
    filters.activo === "activos"
      ? filteredByRol.filter((e) => e.activo === true)
      : filters.activo === "inactivos"
      ? filteredByRol.filter((e) => e.activo === false)
      : filteredByRol;

  const sortedEmployees = [...filteredByEstado].sort((a, b) => {
    if (!sortDirection) return 0;
    const da = new Date(a.created_at).getTime();
    const db = new Date(b.created_at).getTime();
    return sortDirection === "asc" ? da - db : db - da;
  });

  if (isLoading) return <p className="p-4">Cargando empleados...</p>;
  if (isError) return <p className="p-4 text-red-600">Error al cargar datos</p>;

  const openEditModal = (emp: Empleado) => {
    setEditData({ ...emp });
    setOpenModal(true);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("es-MX");
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
          {sortedEmployees.map((emp) => (
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
