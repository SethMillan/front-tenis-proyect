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
                <p className="text-gray-500">Cargando producto...</p>
            </div>
        );
    }

    if (isError || !tenis) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                <p>Error al cargar el producto o no encontrado.</p>
            </div>
        );
    }

    const handleRowClick = (productId: number) => {
        router.push(`/products/edit/${productId}`);
    };

    // --- Lógica para el Grid de Imágenes ---
    const images = tenis.imagenes_productos || [];
    const mainImage = images[0];
    // Tomamos hasta 4 imágenes secundarias para el grid lateral
    const secondaryImages = images.slice(1, 5); 
    const hasSecondaryImages = secondaryImages.length > 0;
    // Calculamos cuántas imágenes "sobran" para un futuro botón "Ver más" (opcional)
    const remainingImagesCount = Math.max(0, images.length - 5);


    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            {/* Header de navegación */}
            <div className="mb-6">
                <Link href={"/products"}>
                    <Button variant="ghost" className='hover:bg-slate-100 flex items-center gap-2 pl-0 text-gray-600'>
                        <ArrowLeft size={20} /> Atrás a productos
                    </Button>
                </Link>
            </div>
            
            {/* Encabezado del Producto */}
            <div className="mb-8">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                    Categoria {tenis.categorias.nombre}
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-1">
                    {tenis.nombre}
                </h1>
            </div>

            {/* Layout Principal: Grid de 2 columnas en escritorio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* COLUMNA IZQUIERDA: Grid de Imágenes (Ocupa 7 de 12 columnas) */}
                <div className="lg:col-span-7">
                     {/* Contenedor principal del grid de fotos. Altura fija para consistencia */}
                    <div className={`grid grid-cols-1 ${hasSecondaryImages ? 'md:grid-cols-5' : ''} gap-2 h-[500px] md:h-[600px] rounded-xl overflow-hidden`}>
                        
                        {/* Imagen Principal: Ocupa 3/5 partes si hay secundarias, si no, todo el ancho */}
                        {mainImage ? (
                            <div className={`h-full ${hasSecondaryImages ? 'md:col-span-3' : 'md:col-span-5'} relative group`}>
                                <img
                                    src={mainImage.url}
                                    alt={tenis.nombre}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            // Placeholder si no hay imágenes
                            <div className="h-full md:col-span-5 bg-gray-100 flex items-center justify-center text-gray-400">
                                Sin imagen
                            </div>
                        )}

                        {/* Imágenes Secundarias: Grid 2x2 en las 2/5 partes restantes */}
                        {hasSecondaryImages && (
                            <div className="md:col-span-2 grid grid-cols-2 grid-rows-2 gap-2 h-full">
                                {secondaryImages.map((img: any, index: number) => (
                                    <div key={img.id} className="relative h-full w-full overflow-hidden">
                                        <img
                                            src={img.url}
                                            alt={`Vista ${index + 1} de ${tenis.nombre}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                        {/* Overlay para la última imagen si hay más de 5 en total (opcional, estilo Airbnb) */}
                                        {index === secondaryImages.length - 1 && remainingImagesCount > 0 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium text-lg cursor-pointer hover:bg-black/60 transition">
                                            +{remainingImagesCount} fotos
                                        </div>
                                        )}
                                    </div>
                                ))}
                                {/* Rellenar espacios vacíos si hay menos de 4 imágenes secundarias para mantener el grid */}
                                {[...Array(4 - secondaryImages.length)].map((_, i) => (
                                    <div key={`empty-${i}`} className="bg-gray-50 h-full w-full"></div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


                {/* COLUMNA DERECHA: Detalles y Acciones (Ocupa 5 de 12 columnas) */}
                <div className="lg:col-span-5 flex flex-col gap-8 py-4">
                    
                    {/* Botón Editar (Movido arriba para fácil acceso) */}
                    <div>
                        <Button variant={'ghost'} className='w-full sm:w-auto cursor-pointer border-gray-300 hover:underline hover:bg-gray-50 flex gap-2' onClick={() => handleRowClick(tenis.id)}>
                            <Edit size={16}/> Editar producto 
                        </Button>
                    </div>

                    {/* Detalles Específicos */}
                    <div className="space-y-3 text-gray-700">
                        <h2 className="font-semibold text-xl text-gray-900 mb-4">Detalles</h2>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <span className="font-medium text-gray-500">Marca:</span>
                            <span>{tenis.marcas.nombre}</span>
                            <span className="font-medium text-gray-500">Color:</span>
                            <span>{tenis.color}</span>
                            <span className="font-medium text-gray-500">ID de Referencia:</span>
                            <span className="font-mono text-xs items-center flex">{tenis.id}</span>
                        </div>
                    </div>
                    
                    {/* Sección de Inventario */}
                    <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                        <h2 className="font-semibold text-xl text-gray-900">Disponibilidad por Talla</h2>
                        
                        {tenis.inventarios.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {tenis.inventarios.map((inv: any) => {
                                const isLowStock = inv.cantidad < 3;
                                return (
                                    <div
                                    key={inv.id}
                                    // Estilos condicionales más sutiles y minimalistas
                                    className={`rounded-lg p-3 flex flex-col items-center justify-center text-center transition-all
                                        ${isLowStock 
                                            ? "bg-red-50 border border-red-100 text-red-800" 
                                            : "bg-white border border-gray-200 text-gray-800 hover:border-gray-400"}`}
                                    >
                                        <span className="text-sm font-medium text-gray-500 uppercase">Talla</span>
                                        <span className="text-xl font-bold">{inv.talla}</span>
                                        <span className={`text-xs mt-1 font-medium ${isLowStock ? 'text-red-600' : 'text-gray-400'}`}>
                                            {inv.cantidad} disponibles
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        ) : (
                            <p className="text-gray-500 italic">No hay información de inventario.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};