"use client";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { fetchByTenisId } from '@/lib/api';
import { Producto } from '@/types/types';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;

        const loadProduct = async () => {
            try {
            const data = await fetchByTenisId(id);
            setProduct(data);
            } catch (error) {
            console.error('Error loading product:', error);
            } finally {
            setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (!product) return <div>Producto no encontrado</div>;

    const handleRowClick = (productId: number) => {
        router.push(`/home/products/edit/${productId}`);
    };

    return (
        <div className="p-8 w-full">
            <Link href={"/home/products"}>
                <Button variant="outline" className='cursor-pointer hover:bg-slate-500'>
                    <ArrowLeft />Atrás
                </Button>
            </Link>
            
            {/* Contenedor del producto -----------------------------------------------------------------------------------------------------------------------*/ }
            <div className="rounded-lg overflow-hidden border w-full mt-4 p-4">
                <div className="flex flex-row gap-8">
                    {/* Contenedor de datos básicos */}
                    <div className="flex-1 flex flex-col gap-2">
                    <p className="text-s">Categoria {product.categorias.nombre}</p>
                    <h1 className="text-4xl font-bold mb-2">{product.nombre}</h1>
                        <div className="flex flex-wrap gap-4">
                            {product.imagenes_productos.map((img: any) => (
                            <img
                                key={img.id}
                                src={img.url}
                                alt={product.nombre}
                                className="w-120 h-120 object-cover rounded border"
                            />
                            ))}
                        </div>
                    </div>

                    {/* Contenedor de datos extras */}
                    <div className="flex-1 flex flex-col gap-6 ">
                        <div>
                            <Button variant={'outline'} className='cursor-pointer' onClick={() => handleRowClick(product.id)}>
                                <Edit/> Editar producto 
                            </Button>
                        </div>

                        <div>
                            <h2 className="font-semibold text-2xl">Detalles del Producto</h2>
                            <p>ID: {product.id}</p>
                            <p>Marca: {product.marcas.nombre}</p>
                            <p>Color: {product.color}</p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-2xl">Tallas y cantidad</h2>
                            <div className="flex flex-row flex-wrap gap-2">
                                {product.inventarios.map((inv: any) => (
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