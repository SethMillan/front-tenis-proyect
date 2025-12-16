"use client";
import React , { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {Table,  TableBody,  TableCell,  TableHead, TableHeader, TableRow,} from "@/components/ui/table"
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

    // Barra de busqueda
    const [search, setSearch] = useState("");

    // Filtros de busqueda
    const [filters, setFilters] = useState({
        marca: "",
        color: "",
        categoria: "",
    });

    // Opciones de Orden de los productos
    const [sortConfig, setSortConfig] = useState<{
        key: "" | "id"  | "nombre" | "color" | "marcas.nombre" ;
        direction: "asc" | "desc";
    }>({
        key: "",
        direction: "asc"
    });

    // Esta función rompe el string "marcas.nombre" y entra nivel por nivel
    const obtenerValor = (objeto: any, ruta: string) => {
        // Divide "marcas.nombre" en ["marcas", "nombre"]
        return ruta.split('.').reduce((obj, clave) => {
            // Entra al objeto. Si algo es null, no da error.
            return obj?.[clave]; 
        }, objeto);
    };

    // Manejo del Ordenamiento
    const handleSort = (key: "" | "id" | "nombre" | "color" | "marcas.nombre" ) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === "asc" ? "desc" : "asc"
        }));
    };

    const stockPill = (cantidad: number) => {
        // Definimos clases base para que se vea como una pastilla
        const baseClasses = "px-2 py-0.5 rounded-full text-xs font-medium border";
        
        if (cantidad > 3) {
            // Stock saludable (Verde)
            return (
                <span className={`${baseClasses} bg-green-100 text-green-800 border-green-200`}>
                    {cantidad}
                </span>
            );
        } else {
            // Stock bajo (Rojo)
            return (
                <span className={`${baseClasses} bg-red-100 text-red-800 border-red-200`}>
                    {cantidad}
                </span>
            );
        }
    };
    
    const processedProducts = useMemo(() => {
        if (!tenis) return [];

        let data = [...tenis];

        // Filtrar por búsqueda
        if (search.trim() !== "") {
            const term = search.toLowerCase();
            data = data.filter((product) =>
                `${product.nombre} ${product.marcas.nombre} ${product.color ?? ""}`
                    .toLowerCase()
                    .includes(term)
            );
        }

        // Filtros
        // 1. Filtro por Marca
        // Verificamos que exista el filtro y que no sea una opción de "ver todas"
        if (filters.marca && filters.marca !== "none") {
            data = data.filter((p) => p.marcas.nombre === filters.marca);
        }

        // 2. Filtro por Color
        if (filters.color && filters.color !== "none") {
            data = data.filter((p) => p.color === filters.color);
        }

        // Ordenar los datos
        if (sortConfig.key) {
            data.sort((a, b) => {
                // 1. Usamos la función obtenerValor para sacar el valor, incluso si está anidado
                const rawA = obtenerValor(a, sortConfig.key);
                const rawB = obtenerValor(b, sortConfig.key);
                
                // 2. Convertimos a string y minúsculas para comparar
                const aValue = (rawA ?? "").toString().toLowerCase();
                const bValue = (rawB ?? "").toString().toLowerCase();

                // 3. Comparación
                if (aValue < bValue) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        return data;
    }, [tenis, search, filters, sortConfig]);

    if (isLoading) {
        return (
            <div className="w-max flex justify-center items-center h-screen text-center">
                <p className="w-max flex justify-center items-center text-center">Cargando productos...</p>
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
    
    const handleRowClick = (productId: number) => {
        router.push(`/products/${productId}`);
    };

    return (
        <div className='pt-1 h-full w-full flex flex-col gap-3 justify-center items-start m-8'>
            <div className="flex flex-center justify-between w-full">
                <h1 className="text-2xl font-bold">Productos</h1>
                <Link href={'/products/create'}>
                    <Button className="hover:bg-green-200 border-1 border-gray-200 bg-gray-50 text-gray-800">Agregar Producto</Button>
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
                            onValueChange={(value) => handleSort(value as "id" | "nombre" | "color" | "marcas.nombre")}
                        >
                            <SelectTrigger className="w-[180px] cursor-pointer">
                            <SelectValue placeholder="Ordenar por:" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="none" className="cursor-pointer">Por ID</SelectItem>
                            <SelectItem value="nombre" className="cursor-pointer">Por nombre (A-Z)</SelectItem>
                            <SelectItem value="color" className="cursor-pointer">Por color (A-Z)</SelectItem>
                            <SelectItem value="marcas.nombre" className="cursor-pointer">Por marca (A-Z)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <div className="overflow-hidden w-full">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/12">ID</TableHead>
                            <TableHead className="w-2/12">Nombre</TableHead>
                            <TableHead className="w-2/12">Color</TableHead>
                            <TableHead className="w-1/12">Marca</TableHead>
                            <TableHead className="w-4/12">Stock (por talla)</TableHead>
                            <TableHead className="w-2/12">Precio de compra</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {processedProducts?.map((product: any) => (
                            <TableRow
                                key={product.id}
                                onClick={() => handleRowClick(product.id)}
                                className="cursor-pointer"
                            >
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.nombre}</TableCell>
                                <TableCell>{product.color}</TableCell>
                                <TableCell>{product.marcas.nombre}</TableCell>
                                <TableCell>
                                    {/* Usamos un contenedor flex para que las tallas se acomoden automáticamente */}
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {product.inventarios.map((inv: any, index: number) => (
                                            <div 
                                                key={index} 
                                                className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-100"
                                            >
                                                {/* La talla en texto normal */}
                                                <span className="text-sm text-gray-600 font-semibold">
                                                    {inv.talla}:
                                                </span>
                                                
                                                {/* Invocamos la función directamente como componente (sin comillas) */}
                                                {stockPill(inv.cantidad)}
                                            </div>
                                        ))}
                                    </div>
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