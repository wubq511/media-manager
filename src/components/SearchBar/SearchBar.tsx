import { Search, X, Music, Video, Image } from 'lucide-react';
import { useMedia } from '../../contexts/MediaContext';
import './SearchBar.css';

export default function SearchBar() {
  const { state, dispatch } = useMedia();

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search media files..."
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
          className="search-input"
        />
        {state.searchQuery && (
          <button 
            className="clear-btn"
            onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${state.filterType === 'all' ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_FILTER_TYPE', payload: 'all' })}
        >
          All
        </button>
        <button
          className={`filter-tab ${state.filterType === 'audio' ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_FILTER_TYPE', payload: 'audio' })}
        >
          <Music size={14} />
          Audio
        </button>
        <button
          className={`filter-tab ${state.filterType === 'video' ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_FILTER_TYPE', payload: 'video' })}
        >
          <Video size={14} />
          Video
        </button>
        <button
          className={`filter-tab ${state.filterType === 'image' ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_FILTER_TYPE', payload: 'image' })}
        >
          <Image size={14} />
          Image
        </button>
      </div>
    </div>
  );
}
