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
import { useState } from "react";
import { toast } from "react-toastify";
import { updateCliente } from "@/lib/api";
import { useClientes } from "@/hooks/useAPI";

export function TableCustomers({
    data,
    onRowClick,
}: {
    data: Customer[];
    onRowClick?: (customer: Customer) => void;
}) {
    const { mutate } = useClientes();
    const [editData, setEditData] = useState<Customer | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const openEditModal = (customer: Customer) => {
        setEditData({ ...customer });
        setOpenModal(true);
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("es-MX");
    };

    const handleUpdate = async () => {
        if (!editData) return;

        setLoading(true);

        try {
            const payload = {
                nombres: editData.nombres,
                apellido_p: editData.apellido_p,
                apellido_m: editData.apellido_m || undefined,
                telefono: editData.telefono || undefined,
                email: editData.email || undefined,
            };

            await updateCliente(editData.id, payload);

            toast.success("Cliente actualizado correctamente", {
                toastId: "cliente-update-success",
            });

            mutate();
            setOpenModal(false);
        } catch (error: any) {
            toast.error(
                error.message || "Error al actualizar el cliente",
                {
                    toastId: "cliente-update-error",
                }
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
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
                            className={
                                onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                            }
                            onClick={() => onRowClick?.(c)}
                        >
                            <TableCell>{c.id}</TableCell>
                            <TableCell>
                                {c.nombres} {c.apellido_p} {c.apellido_m ?? ""}
                            </TableCell>
                            <TableCell>{c.telefono ?? "—"}</TableCell>
                            <TableCell>{c.email ?? "—"}</TableCell>
                            <TableCell>
                                {c.fecha_nacimiento
                                    ? formatDate(c.fecha_nacimiento)
                                    : "—"}
                            </TableCell>
                            <TableCell>
                                {c.activo ? (
                                    <span className="text-green-600 font-semibold">
                                        Activo
                                    </span>
                                ) : (
                                    <span className="text-red-600 font-semibold">
                                        Inactivo
                                    </span>
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

                    {editData && (
                        <div className="space-y-4 mt-2">
                            <div>
                                <Label>Nombres</Label>
                                <Input
                                    value={editData.nombres}
                                    onChange={(e) =>
                                        setEditData({ ...editData, nombres: e.target.value })
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
                                    <Switch checked={editData.activo ?? false} disabled />
                                    <span>{editData.activo ? "Activo" : "Inactivo"}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenModal(false)}
                        >
                            Cerrar
                        </Button>

                        <Button onClick={handleUpdate} disabled={loading}>
                            {loading ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
