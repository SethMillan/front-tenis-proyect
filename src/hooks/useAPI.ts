'use client';

import useSWR from 'swr';
// aqui traigan las funciones de fetch que 
import { fetchTenis, fetchByTenisId, fetchEmpleados, fetchClientes } from '@/lib/api';

export function useTenis() {
  const { data, error, isLoading, mutate } = useSWR('/productos', fetchTenis);
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