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
import { useClientes } from "@/hooks/useAPI"; 

interface TableCustomersProps {
    searchTerm: string;
    filters: {
        activo: string;
    };
    sortDirection: "" | "asc" | "desc";
}

export function TableCustomers({
    searchTerm,
    filters,
    sortDirection,
}: TableCustomersProps) {
    const [editData, setEditData] = useState<Customer | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const { clientes, isLoading, isError } = useClientes();

    const uniqueCustomers = useMemo(() => {
        if (!clientes) return [];
        const map = new Map<number, Customer>();
        clientes.forEach((c) => map.set(c.id, c));
        return Array.from(map.values());
    }, [clientes]);

    const FUSE_OPTIONS = useMemo(
        () => ({
            keys: ["nombres", "apellido_p", "apellido_m", "email", "telefono"],
            threshold: 0.4,
        }),
        []
    );

    const filteredCustomers = useFuseSearch(
        uniqueCustomers,
        searchTerm,
        FUSE_OPTIONS
    );

    // FILTRO POR ESTADO
    const filteredByEstado =
        filters.activo === "activos"
            ? filteredCustomers.filter((c) => c.activo)
            : filters.activo === "inactivos"
            ? filteredCustomers.filter((c) => !c.activo)
            : filteredCustomers;

    // ORDENAR POR FECHA
    const sortedCustomers = [...filteredByEstado].sort((a, b) => {
        if (!sortDirection) return 0;
        const da = new Date(a.created_at!).getTime();
        const db = new Date(b.created_at!).getTime();
        return sortDirection === "asc" ? da - db : db - da;
    });

    if (isLoading) return <p className="p-4">Cargando clientes...</p>;
    if (isError) return <p className="p-4 text-red-600">Error al cargar datos</p>;

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
                    {sortedCustomers.map((c) => (
                        <TableRow key={c.id}>
                            <TableCell>{c.id}</TableCell>
                            <TableCell>
                                {c.nombres} {c.apellido_p} {c.apellido_m ?? ""}
                            </TableCell>
                            <TableCell>{c.telefono ?? "—"}</TableCell>
                            <TableCell>{c.email ?? "—"}</TableCell>
                            <TableCell>
                                {c.fecha_nacimiento ? formatDate(c.fecha_nacimiento) : "—"}
                            </TableCell>
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
                                    onClick={() => openEditModal(c)}
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
