"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer } from "@/types/types";
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
import { toast } from "react-toastify";
import { updateCliente } from "@/lib/api";
import { useClientes } from "@/hooks/useAPI";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


const editClienteSchema = z.object({
  nombres: z.string().min(2, "Debe tener al menos 2 caracteres"),
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
  activo: z.boolean(),
});

type EditClienteForm = z.infer<typeof editClienteSchema>;

export function TableCustomers({
  data,
  onRowClick,
}: {
  data: Customer[];
  onRowClick?: (customer: Customer) => void;
}) {
  const { mutate } = useClientes();
  const [openModal, setOpenModal] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditClienteForm>({
    resolver: zodResolver(editClienteSchema),
  });

  const activoValue = watch("activo");

  const openEditModal = (customer: Customer) => {
    setCurrentId(customer.id);

    reset({
      nombres: customer.nombres,
      apellido_p: customer.apellido_p,
      apellido_m: customer.apellido_m ?? "",
      telefono: customer.telefono ?? "",
      email: customer.email ?? "",
      activo: customer.activo ?? false,
    });

    setOpenModal(true);
  };

  const onSubmit = async (data: EditClienteForm) => {
    if (!currentId) return;

    try {
      await updateCliente(currentId, {
        ...data,
        apellido_m: data.apellido_m || undefined,
        telefono: data.telefono || undefined,
        email: data.email || undefined,
      });

      toast.success("Cliente actualizado correctamente");
      mutate();
      setOpenModal(false);
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar el cliente");
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
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Fecha Nac.</TableHead>
            <TableHead>Activo</TableHead>
            <TableHead>Fecha Alta</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((c) => (
            <TableRow
              key={c.id}
              className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
              onClick={() => onRowClick?.(c)}
            >
              <TableCell>{c.id}</TableCell>
              <TableCell>
                {c.nombres} {c.apellido_p} {c.apellido_m ?? ""}
              </TableCell>
              <TableCell>{c.telefono ?? "—"}</TableCell>
              <TableCell>{c.email ?? "—"}</TableCell>
              <TableCell>{formatDate(c.fecha_nacimiento)}</TableCell>
              <TableCell>
                {c.activo ? (
                  <span className="text-green-600 font-semibold">Activo</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactivo</span>
                )}
              </TableCell>
              <TableCell>{formatDate(c.created_at)}</TableCell>

              <TableCell className="text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(c);
                  }}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
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
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div>
              <Label>Nombres</Label>
              <Input {...register("nombres")} />
              {errors.nombres && (
                <p className="text-red-500 text-sm">{errors.nombres.message}</p>
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
