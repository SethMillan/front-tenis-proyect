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
import { Loader2, Pencil } from "lucide-react";
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
import { useMemo, useState } from "react";
import { useEmpleados } from "@/hooks/useAPI";
import { updateEmpleado } from "@/lib/api";
import { toast } from "react-toastify";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const editEmpleadoSchema = z.object({
  nombre: z.string().min(2, "Debe tener al menos 2 caracteres"),
  apellido_p: z.string().min(2, "Debe tener al menos 2 caracteres"),
  apellido_m: z.string().optional(),
  telefono: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{10,15}$/.test(val),
      "El teléfono debe tener entre 10 y 15 dígitos"
    ),
  email: z.string().email("Correo no válido").optional(),
  rol: z.enum(["Admin", "Employee"]),
  activo: z.boolean(),
});

type EditEmpleadoForm = z.infer<typeof editEmpleadoSchema>;

type Props = {
  data: Empleado[];
};

export function TableEmployees({ data }: Props) {
  const { mutate } = useEmpleados();
  const [openModal, setOpenModal] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditEmpleadoForm>({
    resolver: zodResolver(editEmpleadoSchema),
  });

  const activoValue = watch("activo");

  const uniqueEmployees = useMemo(() => {
    const map = new Map<number, Empleado>();
    data?.forEach((e) => map.set(e.id, e));
    return Array.from(map.values());
  }, [data]);

  const openEditModal = (emp: Empleado) => {
    setCurrentId(emp.id);
    reset({
      nombre: emp.nombre,
      apellido_p: emp.apellido_p,
      apellido_m: emp.apellido_m ?? "",
      telefono: emp.telefono ?? "",
      email: emp.email ?? "",
      rol: emp.rol,
      activo: emp.activo ?? false,
    });
    setOpenModal(true);
  };

  const onSubmit = async (data: EditEmpleadoForm) => {
    if (!currentId) return;

    try {
      await updateEmpleado(currentId, {
        ...data,
        apellido_m: data.apellido_m || undefined,
        telefono: data.telefono || undefined,
        email: data.email || undefined,
      });

      toast.success("Empleado actualizado correctamente");
      mutate();
      setOpenModal(false);
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar el empleado");
    }
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
                <div className="flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Cargando empleados...</span>
                </div>
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div>
              <Label>Nombre</Label>
              <Input {...register("nombre")} />
              {errors.nombre && (
                <p className="text-red-500 text-sm">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <Label>Apellido Paterno</Label>
              <Input {...register("apellido_p")} />
              {errors.apellido_p && (
                <p className="text-red-500 text-sm">
                  {errors.apellido_p.message}
                </p>
              )}
            </div>

            <div>
              <Label>Apellido Materno</Label>
              <Input {...register("apellido_m")} />
            </div>

            <div>
              <Label>Rol</Label>
              <select
                {...register("rol")}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
              </select>
            </div>

            <div>
              <Label>Teléfono</Label>
              <Input {...register("telefono")} />
              {errors.telefono && (
                <p className="text-red-500 text-sm">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label>Activo</Label>
              <div className="flex items-center gap-2 mt-1">
                <Switch
                  checked={activoValue}
                  onCheckedChange={(v) => setValue("activo", v)}
                />
                <span>{activoValue ? "Activo" : "Inactivo"}</span>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenModal(false)}
              >
                Cerrar
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
