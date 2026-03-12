import { useState } from 'react';
import { Plus, Grid, List, Upload } from 'lucide-react';
import { useMedia } from '../../contexts/MediaContext';
import FileCard from '../../components/FileCard/FileCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import UploadModal from '../../components/UploadModal/UploadModal';
import MediaPlayer from '../../components/MediaPlayer/MediaPlayer';
import type { MediaFile } from '../../types';
import './Home.css';

export default function Home() {
  const { getFilteredFiles, deleteFile, toggleFavorite, addToHistory } = useMedia();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [playingFile, setPlayingFile] = useState<MediaFile | null>(null);

  const files = getFilteredFiles();

  const handlePlay = (file: MediaFile) => {
    setPlayingFile(file);
    addToHistory(file.id, 0);
  };

  const handlePlayerClose = () => {
    setPlayingFile(null);
  };

  const handleProgressUpdate = (progress: number) => {
    if (playingFile) {
      addToHistory(playingFile.id, progress);
    }
  };

  return (
    <div className="home-page">
      <header className="page-header">
        <div className="header-left">
          <h1 className="page-title">All Media</h1>
          <span className="file-count">{files.length} files</span>
        </div>
        
        <SearchBar />
        
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
          
          <button className="upload-btn" onClick={() => setIsUploadOpen(true)}>
            <Upload size={18} />
            <span>Upload</span>
          </button>
        </div>
      </header>

      {files.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Plus size={48} />
          </div>
          <h3>No media files yet</h3>
          <p>Upload your first audio or video file to get started</p>
          <button className="upload-btn-large" onClick={() => setIsUploadOpen(true)}>
            <Upload size={20} />
            Upload Media
          </button>
        </div>
      ) : (
        <div className={`file-grid ${viewMode}`}>
          {files.map(file => (
            <FileCard
              key={file.id}
              file={file}
              onPlay={handlePlay}
              onDelete={deleteFile}
              onToggleFavorite={toggleFavorite}
              isPlaying={playingFile?.id === file.id}
            />
          ))}
        </div>
      )}

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      
      <MediaPlayer 
        file={playingFile} 
        onClose={handlePlayerClose}
        onProgressUpdate={handleProgressUpdate}
      />
    </div>
  );
}
