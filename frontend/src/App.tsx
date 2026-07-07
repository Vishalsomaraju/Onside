import { QueryForm } from './components/QueryForm';
import { RouteResult } from './components/RouteResult';
import { useRoute } from './hooks/useRoute';
import './App.css';

function App() {
  const { fetchRoute, result, error, loading } = useRoute();

  return (
    <div className="app-container">
      <header>
        <h1>Smart Stadiums Router</h1>
      </header>
      
      <main>
        <section className="form-section">
          <QueryForm onSubmit={fetchRoute} isLoading={loading} />
        </section>
        
        <section className="result-section" aria-live="polite">
          <RouteResult result={result} error={error} isLoading={loading} />
        </section>
      </main>
    </div>
  );
}

export default App;
