import { Heart, Trash2 } from 'lucide-react';
import { useMedia } from '../../contexts/MediaContext';
import { formatFileSize, formatDate } from '../../utils/helpers';
import './Favorites.css';

export default function Favorites() {
  const { state, toggleFavorite, deleteFile } = useMedia();
  const favorites = state.files.filter(f => f.favorite);

  return (
    <div className="favorites-page">
      <header className="page-header">
        <div className="header-left">
          <div className="page-icon">
            <Heart size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="page-title">Favorites</h1>
            <span className="file-count">{favorites.length} saved</span>
          </div>
        </div>
      </header>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Heart size={48} />
          </div>
          <h3>No favorites yet</h3>
          <p>Files you favorite will appear here for easy access</p>
        </div>
      ) : (
        <div className="favorites-list">
          {favorites.map(file => (
            <div key={file.id} className="favorite-item">
              <div className="item-thumbnail">
                <span className="type-badge">{file.type}</span>
              </div>
              <div className="item-info">
                <h4>{file.name}</h4>
                <div className="item-meta">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span>{formatDate(file.createdAt)}</span>
                </div>
              </div>
              <div className="item-actions">
                <button 
                  className="action-btn"
                  onClick={() => toggleFavorite(file.id)}
                  title="Remove from favorites"
                >
                  <Heart size={18} fill="currentColor" />
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => deleteFile(file.id)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
