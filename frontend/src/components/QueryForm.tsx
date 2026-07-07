import { FormEvent, useState } from 'react';
import { DirectionsRequest } from '@smart-stadiums/shared';

interface QueryFormProps {
  onSubmit: (request: DirectionsRequest) => void;
  isLoading: boolean;
}

export function QueryForm({ onSubmit, isLoading }: QueryFormProps) {
  const [originId, setOriginId] = useState('gate-a');
  const [query, setQuery] = useState('');
  const [matchPhase, setMatchPhase] = useState<'pre-match' | 'in-progress' | 'halftime' | 'post-match'>('pre-match');
  const [language, setLanguage] = useState('en');
  const [accessibilityRequired, setAccessibilityRequired] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    onSubmit({
      originId,
      query: query.trim(),
      matchPhase,
      language,
      accessibilityRequired
    });
  };

  return (
    <form onSubmit={handleSubmit} className="query-form" aria-labelledby="form-heading">
      <h2 id="form-heading">Find Your Way</h2>
      
      <fieldset>
        <legend>Route Requirements</legend>
        
        <div className="form-group">
          <label htmlFor="origin-select">Starting Location</label>
          <select 
            id="origin-select" 
            value={originId} 
            onChange={e => setOriginId(e.target.value)}
            disabled={isLoading}
          >
            <option value="gate-a">Gate A</option>
            <option value="gate-b">Gate B</option>
            <option value="block-101">Block 101</option>
            <option value="restroom-1">Restroom 1</option>
            <option value="food-1">Food Stand 1</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="query-input">What do you need?</label>
          <input 
            type="text" 
            id="query-input" 
            value={query} 
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. wheelchair bathroom, hot dog"
            required
            disabled={isLoading}
            aria-describedby="query-help"
          />
          <span id="query-help" className="help-text">Enter where you want to go or what you need to find. Mention accessibility if needed.</span>
        </div>

        <div className="form-group">
          <label htmlFor="match-phase-select">Match Phase (for congestion)</label>
          <select 
            id="match-phase-select" 
            value={matchPhase} 
            onChange={e => setMatchPhase(e.target.value as 'pre-match' | 'in-progress' | 'halftime' | 'post-match')}
            disabled={isLoading}
          >
            <option value="pre-match">Pre-match</option>
            <option value="in-progress">In-progress</option>
            <option value="halftime">Halftime</option>
            <option value="post-match">Post-match</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="language-select">Language</label>
          <select 
            id="language-select" 
            value={language} 
            onChange={e => setLanguage(e.target.value)}
            disabled={isLoading}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={accessibilityRequired}
              onChange={e => setAccessibilityRequired(e.target.checked)}
              disabled={isLoading}
            />
            Require Accessible Route
          </label>
        </div>

      </fieldset>

      <button type="submit" disabled={isLoading || !query.trim()}>
        {isLoading ? 'Finding route...' : 'Get Directions'}
      </button>
    </form>
  );
}
