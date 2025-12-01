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

type Props = {
  data: Empleado[];
};

export function TableEmployees({ data }: Props) {
  const [editData, setEditData] = useState<Empleado | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const uniqueEmployees = useMemo(() => {
    if (!data) return [];
    const map = new Map<number, Empleado>();
    data.forEach((emp) => map.set(emp.id, emp));
    return Array.from(map.values());
  }, [data]);

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
          {uniqueEmployees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{emp.id}</TableCell>
              <TableCell className="cursor-pointer">
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
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <Pencil size={18} />
                </button>
              </TableCell>
            </TableRow>
          ))}

          {uniqueEmployees.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                No se encontraron empleados
              </TableCell>
            </TableRow>
          )}
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
                  className="cursor-pointer"
                  value={editData.nombre}
                  onChange={(e) =>
                    setEditData({ ...editData, nombre: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Apellido Paterno</Label>
                <Input
                  className="cursor-pointer"
                  value={editData.apellido_p}
                  onChange={(e) =>
                    setEditData({ ...editData, apellido_p: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Apellido Materno</Label>
                <Input
                  className="cursor-pointer"
                  value={editData.apellido_m ?? ""}
                  onChange={(e) =>
                    setEditData({ ...editData, apellido_m: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Rol</Label>
                <Input
                  className="cursor-pointer"
                  value={editData.rol}
                  onChange={(e) =>
                    setEditData({ ...editData, rol: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Teléfono</Label>
                <Input
                  className="cursor-pointer"
                  value={editData.telefono ?? ""}
                  onChange={(e) =>
                    setEditData({ ...editData, telefono: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  className="cursor-pointer"
                  value={editData.email ?? ""}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Activo</Label>

                <div className="flex items-center gap-2 mt-1 cursor-pointer">
                  <Switch
                    className="cursor-pointer"
                    checked={editData.activo ?? false}
                    onCheckedChange={(val) =>
                      setEditData({ ...editData, activo: val })
                    }
                  />
                  <span className="cursor-pointer">
                    {editData.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenModal(false)}
              className="cursor-pointer"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
