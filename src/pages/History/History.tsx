import { Clock, Play, Trash2 } from 'lucide-react';
import { useMedia } from '../../contexts/MediaContext';
import { formatFileSize, formatDate } from '../../utils/helpers';
import './History.css';

export default function History() {
  const { state, addToHistory, clearHistory } = useMedia();

  const getFileById = (fileId: string) => {
    return state.files.find(f => f.id === fileId);
  };

  const handlePlay = (fileId: string) => {
    const file = getFileById(fileId);
    if (file) {
      addToHistory(fileId, 0);
    }
  };

  const uniqueHistory = state.history.reduce((acc: typeof state.history, item) => {
    if (!acc.some(h => h.fileId === item.fileId)) {
      acc.push(item);
    }
    return acc;
  }, []);

  return (
    <div className="history-page">
      <header className="page-header">
        <div className="header-left">
          <div className="page-icon history">
            <Clock size={24} />
          </div>
          <div>
            <h1 className="page-title">Play History</h1>
            <span className="file-count">{uniqueHistory.length} unique files</span>
          </div>
        </div>
        
        {uniqueHistory.length > 0 && (
          <button 
            className="clear-btn"
            onClick={clearHistory}
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </header>

      {uniqueHistory.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Clock size={48} />
          </div>
          <h3>No play history</h3>
          <p>Your recently played files will appear here</p>
        </div>
      ) : (
        <div className="history-list">
          {uniqueHistory.map(item => {
            const file = getFileById(item.fileId);
            if (!file) return null;
            
            return (
              <div key={item.id} className="history-item">
                <div className="item-thumbnail" onClick={() => handlePlay(file.id)}>
                  <span className="type-badge">{file.type}</span>
                  <div className="play-overlay">
                    <Play size={20} />
                  </div>
                </div>
                <div className="item-info">
                  <h4>{file.name}</h4>
                  <div className="item-meta">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>Played {formatDate(item.playedAt)}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
