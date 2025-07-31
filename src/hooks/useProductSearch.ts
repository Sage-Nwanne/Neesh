// Add debouncing and caching for better performance
import { useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

export const useProductSearch = () => {
  // Debounce search queries
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      // Your search logic here
    }, 300),
    []
  );

  // Memoize expensive calculations
  const filteredProducts = useMemo(() => {
    return products.filter(/* your filter logic */);
  }, [products, filters, searchQuery]);
};