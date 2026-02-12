import { createSignal, onMount } from 'solid-js';

interface Package {
  key: string;
  name: string;
  version: string;
  type?: string;
  architecture?: string | null;
  description?: string;
  maintainer?: string;
  license?: string | null;
  homepage?: string;
  dependencies: string[];
  conflicts: string[];
  _source_repo: string;
  _last_updated?: string;
  [key: string]: any;
}

interface PackageData {
  [key: string]: any;
}

const usePackageData = () => {
  const [packages, setPackages] = createSignal<Package[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      console.log('Starting to fetch packages.json');
      // Используем относительный путь к файлу в публичной папке
      const response = await fetch('/packages.json');
      console.log('Response received:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PackageData = await response.json();
      console.log('Data parsed, number of packages:', Object.keys(data).length);

      // Преобразование объекта в массив пакетов
      const packageArray = Object.entries(data).map(([key, pkg]) => {
        // Убедимся, что у каждого пакета есть все необходимые поля
        return {
          key,
          name: pkg.name || key,
          version: pkg.version || 'unknown',
          architecture: pkg.architecture || 'N/A',
          description: pkg.description || 'No description available',
          maintainer: pkg.maintainer || 'Unknown',
          license: pkg.license || 'Not specified',
          homepage: pkg.homepage || '#',
          dependencies: pkg.dependencies || [],
          conflicts: pkg.conflicts || [],
          _source_repo: pkg._source_repo || '#',
          _last_updated: pkg._last_updated || null,
          ...pkg
        };
      });

      console.log('Setting packages and updating loading state');
      setPackages(packageArray);
      setLoading(false);
      console.log('Loading state updated to false');
    } catch (err) {
      console.error('Error loading packages:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
      console.log('Loading state updated to false due to error');
    }
  });

  return { packages, loading, error };
};

export default usePackageData;