// frontend/src/pages/SearchResults.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import debounce from "lodash/debounce";
import SearchResultCard from '../../src/components/SearchResultCard';
import { searchProviders } from '../../src/services/api';
import toast from 'react-hot-toast';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setProviders([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const response = await searchProviders(query);
        setProviders(response);
        setLoading(false);
} catch (err) {
  setError(err.message || 'Failed to fetch search results');
  toast.error(err.message || 'Search failed');
  setLoading(false);
}
    }, 300),
    []
  );

  // Fetch providers when search params change
  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel(); // Cleanup debounce on unmount
  }, [searchQuery, debouncedSearch]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Search Form */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Service Providers</h1>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            name="query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by skill or name (e.g., Fashion Designer or John Doe)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search by skill or name"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Section */}
      {loading && <div className="text-center py-10">Loading...</div>}
      {error && (
        <div className="text-center py-10 text-red-500">
          {error}
          <button
            onClick={() => debouncedSearch(searchQuery)}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !error && providers.length === 0 && (
        <div className="text-center py-10 text-gray-600">No providers found. Try adjusting your search.</div>
      )}
      {!loading && !error && providers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <SearchResultCard key={provider._id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;