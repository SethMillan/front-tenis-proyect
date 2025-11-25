"use client";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { Producto } from '@/types/types';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { useTenisById } from "@/hooks/useAPI";
import Link from 'next/link';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const { tenis, isLoading, isError } = useTenisById(id);
    const router = useRouter();

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

    const handleRowClick = (productId: number) => {
        router.push(`/products/edit/${productId}`);
    };

    return (
        <div className="p-8 w-full">
            <Link href={"/products"}>
                <Button variant="outline" className='cursor-pointer hover:bg-slate-500'>
                    <ArrowLeft />Atrás
                </Button>
            </Link>
            
            {/* Contenedor del producto -----------------------------------------------------------------------------------------------------------------------*/ }
            <div className="rounded-lg overflow-hidden border w-full mt-4 p-4">
                <div className="flex flex-row gap-8">
                    {/* Contenedor de datos básicos */}
                    <div className="flex-1 flex flex-col gap-2">
                    <p className="text-s">Categoria {tenis?.categorias.nombre}</p>
                    <h1 className="text-4xl font-bold mb-2">{tenis?.nombre}</h1>
                        <div className="flex flex-wrap gap-4">
                            {tenis?.imagenes_productos.map((img: any) => (
                            <img
                                key={img.id}
                                src={img.url}
                                alt={tenis?.nombre}
                                className="w-120 h-120 object-cover rounded border"
                            />
                            ))}
                        </div>
                    </div>

                    {/* Contenedor de datos extras */}
                    <div className="flex-1 flex flex-col gap-6 ">
                        <div>
                            <Button variant={'outline'} className='cursor-pointer' onClick={() => handleRowClick(tenis?.id)}>
                                <Edit/> Editar producto 
                            </Button>
                        </div>

                        <div>
                            <h2 className="font-semibold text-2xl">Detalles del Producto</h2>
                            <p>ID: {tenis?.id}</p>
                            <p>Marca: {tenis?.marcas.nombre}</p>
                            <p>Color: {tenis?.color}</p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-2xl">Tallas y cantidad</h2>
                            <div className="flex flex-row flex-wrap gap-2">
                                {tenis?.inventarios.map((inv: any) => (
                                    <div
                                    key={inv.id}
                                    className={`w-28 h-20 border rounded-lg p-2 flex flex-col items-center justify-center 
                                        ${inv.cantidad < 3 ? "bg-red-200 border-red-500" : "bg-white border-gray-300"}`}
                                    >
                                    <p>Talla: {inv.talla}</p>
                                    <p>Cantidad: {inv.cantidad}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};