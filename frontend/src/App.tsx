import { useState } from 'react';
import './App.css';
import { useSearch } from './useSearch';
import { PdfUploader } from './components/PdfUploader';

function App() {
  const [query, setQuery] = useState('');
  const { results, error, loading } = useSearch(query);

  return (
    <div id="root">
      <div className="logos">
        {/* …existing logos… */}
      </div>

      <h1>Search demo</h1>

      {/* PDF upload UI */}
      <PdfUploader />

      {/* Search input */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {results.map(hit => (
          <li key={hit.id}>{JSON.stringify(hit)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;