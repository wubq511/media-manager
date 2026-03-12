import { Music, Video, Image, Heart, Trash2, MoreVertical, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import type { MediaFile } from '../../types';
import { formatFileSize, formatDuration } from '../../utils/helpers';
import './FileCard.css';

interface FileCardProps {
  file: MediaFile;
  onPlay: (file: MediaFile) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isPlaying?: boolean;
}

export default function FileCard({ file, onPlay, onDelete, onToggleFavorite, isPlaying }: FileCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const isImage = file.type === 'image';

  return (
    <div className={`file-card ${isPlaying ? 'playing' : ''}`}>
      <div className="file-thumbnail" onClick={() => onPlay(file)}>
        {file.thumbnail || isImage ? (
          <img src={file.url} alt={file.name} />
        ) : (
          <div className="thumbnail-placeholder">
            {file.type === 'audio' ? <Music size={32} /> : file.type === 'image' ? <Image size={32} /> : <Video size={32} />}
          </div>
        )}
        {file.type !== 'image' && (
          <div className="play-overlay">
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </div>
        )}
        {file.duration && (
          <span className="duration-badge">{formatDuration(file.duration)}</span>
        )}
      </div>

      <div className="file-info">
        <h4 className="file-name" title={file.name}>{file.name}</h4>
        <div className="file-meta">
          <span>{formatFileSize(file.size)}</span>
          <span className="separator">•</span>
          <span>{file.type}</span>
        </div>
      </div>

      <div className="file-actions">
        <button
          className={`action-btn favorite-btn ${file.favorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(file.id)}
          title={file.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={18} fill={file.favorite ? 'currentColor' : 'none'} />
        </button>
        
        <div className="menu-wrapper">
          <button
            className="action-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => { onDelete(file.id); setShowMenu(false); }}>
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
