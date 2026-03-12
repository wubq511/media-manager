import { NavLink } from 'react-router-dom';
import { Home, Heart, Clock, FolderPlus, Music, Video, Folder } from 'lucide-react';
import { useMedia } from '../../contexts/MediaContext';
import './Sidebar.css';

export default function Sidebar() {
  const { state, addFolder } = useMedia();

  const handleAddFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      addFolder(name, state.currentFolder);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Music size={24} />
        </div>
        <span className="logo-text">MediaVault</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>All Media</span>
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Heart size={20} />
          <span>Favorites</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Clock size={20} />
          <span>History</span>
        </NavLink>
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <div className="section-header">
          <span>Folders</span>
          <button className="icon-btn" onClick={handleAddFolder} title="New Folder">
            <FolderPlus size={16} />
          </button>
        </div>
        
        <div className="folder-list">
          <button 
            className={`folder-item ${state.currentFolder === null ? 'active' : ''}`}
            onClick={() => {}}
          >
            <Folder size={18} />
            <span>All Files</span>
          </button>
          {state.folders.map(folder => (
            <button
              key={folder.id}
              className={`folder-item ${state.currentFolder === folder.id ? 'active' : ''}`}
            >
              <Folder size={18} />
              <span>{folder.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-stats">
        <div className="stat-item">
          <Music size={16} />
          <span>{state.files.filter(f => f.type === 'audio').length} Audio</span>
        </div>
        <div className="stat-item">
          <Video size={16} />
          <span>{state.files.filter(f => f.type === 'video').length} Video</span>
        </div>
      </div>
    </aside>
  );
}
