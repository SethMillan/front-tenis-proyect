"use client";
import React , { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Table,  TableBody,  TableCell,  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";

import { useFuseSearch } from "@/hooks/useFuseSearch";
import { useTenis, useCategorias, useMarcas } from "@/hooks/useAPI";

import { Categoria, Marca, Producto } from "@/types/types";
import { Filter, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from "next/link";

const FUSE_OPTIONS = {
    keys: ["nombre", "marcas.nombre", "color"],
    threshold: 0.4,
};    

const page = () => {
    const { tenis, isLoading, isError } = useTenis();
    const { marcas } = useMarcas();
    const router = useRouter();

    /* Barra de busqueda */
    const [search, setSearch] = useState("");

    /* Filtros de busqueda */
    const [filters, setFilters] = useState({
        marca: "",
        color: "",
        categoria: "",
        minTotal: "",
        maxTotal: "",
    });

    {/* Orden de los productos */}
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Producto | "" | "marcas";
        direction: "asc" | "desc";
    }>({
        key: "",
        direction: "asc"
    });

    {/* Manejo del Orden */}
    const handleSort = (key: keyof Producto) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
        }));
    };
    
    const resultados = useFuseSearch(tenis || [], search, FUSE_OPTIONS);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-center">
                <p>Cargando productos...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Error al cargar los productos</p>
            </div>
        );
    }
    
   /* const filteredResults = resultados.filter((product: Producto) => {
        // Filtro por marca
        if (filters.marca && filters.marca !== "none" && product.marcas.nombre !== filters.marca) {
            return false;
        }

        // Filtro por color
        if (filters.color && filters.color !== "none" && product.color !== filters.color) {
            return false;
        }

        return true;
    });

    const sortedResults = [...filteredResults].sort((a, b) => {
        if (!sortConfig.key) return 0;
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "marcas") {
            aValue = a.marcas.nombre;
            bValue = b.marcas.nombre;
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return 0;
    });*/

    const handleRowClick = (productId: number) => {
        router.push(`/products/${productId}`);
    };

    return (
        <div className='pt-1 h-full w-full flex flex-col gap-3 justify-center items-start m-8'>
            <div className="flex flex-center justify-between w-full">
                <h1 className="text-2xl font-bold">Productos</h1>
                <Link href={'/products/create'}>
                    <Button className="bg-green-600 hover:bg-green-400">Agregar Producto</Button>
                </Link>
            </div>

            <div className="flex items-center gap-5 w-full">
                <div className="relative flex-1 w-lvh">
                    <Input
                    placeholder="Buscar tenis por nombre, color o marca"
                    className="pl-10"
                    onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Filtros
                    </Button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Filtros de busqueda</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="marca">Marcas</label>
                            <Select
                            value={filters.marca}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, marca: value }))}
                            >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecciona la marca" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Todos</SelectItem>
                                {marcas?.map((mar: any) => (
                                    <SelectItem key={mar.id} value={mar.nombre}>{mar.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </div>
                        </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="color">Colores</label>
                                <Select
                                value={filters.color}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, color: value }))}
                                >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Selecciona el color" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Todos</SelectItem>
                                    <SelectItem value="Negro">Negro</SelectItem>
                                    <SelectItem value="Blanco">Blanco</SelectItem>
                                    <SelectItem value="Gris">Gris</SelectItem>
                                    <SelectItem value="Azul">Azul</SelectItem>
                                    <SelectItem value="Multicolor">Multicolor</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                    </DialogContent>
                </Dialog>
                
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-1">
                    <Select
                        onValueChange={(value) => handleSort(value as keyof Producto)}
                    >
                        <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Ordenar por:" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="none">Por ID</SelectItem>
                        <SelectItem value="nombre">Por nombre (A-Z)</SelectItem>
                        <SelectItem value="color">Por color (A-Z)</SelectItem>
                        <SelectItem value="marcas">Por marca (A-Z)</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                </div>
            </div>
            <div className="rounded-lg overflow-hidden border w-full">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-slate-500 hover:bg-slate-500">
                            <TableHead className="w-1/12 text-white">ID</TableHead>
                            <TableHead className="w-2/12 text-white">Nombre</TableHead>
                            <TableHead className="w-2/12 text-white">Color</TableHead>
                            <TableHead className="w-1/12 text-white">Marca</TableHead>
                            <TableHead className="w-4/12 text-white">Stock (por talla)</TableHead>
                            <TableHead className="w-2/12 text-white">Precio de compra</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resultados?.map((product: any) => (
                            <TableRow
                                key={product.id}
                                onClick={() => handleRowClick(product.id)}
                                className="h-15 cursor-pointer"
                            >
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.nombre}</TableCell>
                                <TableCell>{product.color}</TableCell>
                                <TableCell>{product.marcas.nombre}</TableCell>
                                <TableCell>
                                    {product.inventarios
                                        .map((inv: any) => `${inv.talla} (${inv.cantidad})|`)
                                        .join(", ")
                                    }
                                </TableCell>
                                <TableCell>
                                    {(() => {
                                        const precios = product.inventarios.map((inv: any) => Number(inv.precio_compra));
                                        const promedio = precios.reduce((acc: number, curr:number) => acc + curr, 0) / precios.length;
                                        return `$${promedio.toFixed(2)}`;
                                    })()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
        </div>
    );
}

export default page;