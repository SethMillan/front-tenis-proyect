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

export function TableCustomers({
    data,
    onRowClick,
}: {
    data: Customer[];
    onRowClick?: (customer: Customer) => void;
}) {
    const [editData, setEditData] = useState<Customer | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const openEditModal = (customer: Customer) => {
        setEditData({ ...customer });
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
                                onRowClick
                                    ? "cursor-pointer hover:bg-gray-50"
                                    : ""
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
                                    <span className="text-green-600 font-semibold cursor-default">
                                        Activo
                                    </span>
                                ) : (
                                    <span className="text-red-600 font-semibold cursor-default">
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
                                    <Pencil size={18} className="cursor-pointer" />
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
                                    className="cursor-pointer"
                                    value={editData.nombres}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            nombres: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Apellido Paterno</Label>
                                <Input
                                    className="cursor-pointer"
                                    value={editData.apellido_p}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            apellido_p: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Apellido Materno</Label>
                                <Input
                                    className="cursor-pointer"
                                    value={editData.apellido_m ?? ""}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            apellido_m: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Teléfono</Label>
                                <Input
                                    className="cursor-pointer"
                                    value={editData.telefono ?? ""}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            telefono: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    className="cursor-pointer"
                                    value={editData.email ?? ""}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            email: e.target.value,
                                        })
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
                                            setEditData({
                                                ...editData,
                                                activo: val,
                                            })
                                        }
                                    />
                                    <span className="cursor-default">
                                        {editData.activo
                                            ? "Activo"
                                            : "Inactivo"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setOpenModal(false)}
                        >
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
