'use client';

import useSWR from 'swr';
// aqui traigan las funciones de fetch que 
import { fetchTenis, fetchByTenisId } from '@/lib/api';

export function useTenis() {
  const { data, error, isLoading, mutate } = useSWR('/productos', fetchTenis);
  return { tenis: data, isLoading, isError: error, refetch: mutate };
}

export function useTenisById(id: string | null) {
  const { data, error, isLoading } = useSWR(id ? `/productos/${id}` : null,  () => fetchByTenisId(id!));

  return { tenis: data, isLoading, isError: error };
}

