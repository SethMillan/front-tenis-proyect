'use client';

import useSWR from 'swr';
// aqui traigan las funciones de fetch que 
import { fetchTenis, fetchByTenisId, fetchEmpleados, fetchClientes, fetchCategorias, fetchMarcas,fetchSales, fetchInventario } from '@/lib/api';
import { Inventario, Marca, Venta } from '@/types/types';

export function useTenis() {
  const { data, error, isLoading, mutate } = useSWR('/productos', fetchTenis,
    {
      refreshInterval: 300000, // para el cache
      keepPreviousData: true, // mantiene datos previos mientras carga nuevos 
      dedupingInterval: 60000,// evita multiples solicitudes en un corto periodo
      revalidateOnMount: true,// siempre valida al montar el componente
    }
  );
  return { tenis: data, isLoading, isError: error, refetch: mutate };
}

export function useTenisById(id: string | null) {
  const { data, error, isLoading } = useSWR(id ? `/productos/${id}` : null,  () => fetchByTenisId(id!));

  return { tenis: data, isLoading, isError: error };
}

export function useEmpleados() {
  const { data, error, isLoading } = useSWR('/empleados', fetchEmpleados);
  return { empleados: data, isLoading, isError: error };
}

export function useClientes() {
  const { data, error, isLoading } = useSWR('/clientes', fetchClientes);
  return { clientes: data, isLoading, isError: error };
}

export function useMarcas() {
  const { data, error, isLoading } = useSWR<Marca[]>('/marcas', fetchMarcas);
  return { marcas: data, isLoading, isError: error };
}

export function useCategorias() {
  const { data, error, isLoading } = useSWR('/categorias', fetchCategorias);
  return { categorias: data, isLoading, isError: error };
}
export function useSales() {
  const { data, error, isLoading } = useSWR<Venta[]>('/ventas', fetchSales);
  return { ventas: data || [], isLoading, isError: !!error };
}
export function useInventario() {
  const { data, error, isLoading } = useSWR<Inventario[]>('/inventario', fetchInventario);
  return { inventario: data || [], isLoading, isError: !!error };
}