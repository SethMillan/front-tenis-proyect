// src/hooks/useFuseSearch.ts
import { useMemo } from 'react'
import Fuse, {IFuseOptions} from 'fuse.js'

/*
  ! Hook: useFuseSearch
  ? FuseJS es una biblioteca de busqueda difusa que permite realizar busquedas eficientes y flexibles en conjuntos de datos
  ? Este hook utiliza FuseJS para proporcionar una funcionalidad de busqueda difusa en componentes de React
  * Parametros:
  - data: Array de elementos en los que se realizará la búsqueda.
  - searchTerm: Término de búsqueda que se utilizará para filtrar los datos.
  - options: Opciones de configuración para FuseJS, que permiten personalizar el comportamiento de la búsqueda.
  * Retorna:
  - Array de elementos que coinciden con el término de búsqueda utilizando la lógica de búsqueda difusa de FuseJS.

  ? Deje el parametro del useFuseSearch genérico para que pueda ser utilizado con cualquier tipo de datos (T)
*/

export function useFuseSearch<T>(
  data: T[],
  searchTerm: string,
  options: IFuseOptions<T>
): T[] {
  
  const fuse = useMemo(() => {
    return new Fuse(data, options)
  }, [data, options])
  
  const results = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return data
    }
    console.log('Searching for:', searchTerm);
    return fuse.search(searchTerm).map(result => result.item)
  }, [searchTerm, fuse, data])
  console.log('Search results:', results);
  return results
}