import { useState, useRef } from 'react';
import { Upload, X, Music, Video, Image } from 'lucide-react';
import { useMedia } from '../../contexts/MediaContext';
import './UploadModal.css';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { addFile, state } = useMedia();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(state.currentFolder);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      await addFile(file, selectedFolder);
    }
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Media</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div 
          className={`drop-zone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,video/*,image/*"
            multiple
            onChange={handleInputChange}
            hidden
          />
          <div className="drop-icon">
            <Upload size={40} />
          </div>
          <p className="drop-text">Drag & drop files here</p>
          <p className="drop-subtext">or click to browse</p>
          <div className="supported-formats">
            <span><Music size={14} /> Audio</span>
            <span><Video size={14} /> Video</span>
            <span><Image size={14} /> Image</span>
          </div>
        </div>

        <div className="upload-options">
          <label className="folder-select">
            <span>Save to folder:</span>
            <select 
              value={selectedFolder || ''} 
              onChange={(e) => setSelectedFolder(e.target.value || null)}
            >
              <option value="">Root</option>
              {state.folders.map(folder => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
