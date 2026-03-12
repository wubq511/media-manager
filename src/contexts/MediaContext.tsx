import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { MediaState, MediaAction, MediaFile } from '../types';
import { api } from '../utils/api';

const initialState: MediaState = {
  files: [],
  folders: [],
  history: [],
  currentFolder: null,
  searchQuery: '',
  filterType: 'all',
};

function mediaReducer(state: MediaState, action: MediaAction): MediaState {
  switch (action.type) {
    case 'SET_FILES':
      return { ...state, files: action.payload };
    case 'ADD_FILE':
      return { ...state, files: [...state.files, action.payload] };
    case 'DELETE_FILE':
      return { ...state, files: state.files.filter(f => f.id !== action.payload) };
    case 'UPDATE_FILE':
      return {
        ...state,
        files: state.files.map(f => f.id === action.payload.id ? action.payload : f),
      };
    case 'SET_FOLDERS':
      return { ...state, folders: action.payload };
    case 'ADD_FOLDER':
      return { ...state, folders: [...state.folders, action.payload] };
    case 'DELETE_FOLDER':
      return {
        ...state,
        folders: state.folders.filter(f => f.id !== action.payload),
        files: state.files.map(f => f.folderId === action.payload ? { ...f, folderId: null } : f),
      };
    case 'RENAME_FOLDER':
      return {
        ...state,
        folders: state.folders.map(f =>
          f.id === action.payload.id ? { ...f, name: action.payload.name } : f
        ),
      };
    case 'SET_CURRENT_FOLDER':
      return { ...state, currentFolder: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTER_TYPE':
      return { ...state, filterType: action.payload };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'ADD_TO_HISTORY':
      return { ...state, history: [action.payload, ...state.history.slice(0, 99)] };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    default:
      return state;
  }
}

interface MediaContextType {
  state: MediaState;
  dispatch: React.Dispatch<MediaAction>;
  addFile: (file: File, folderId: string | null) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  addFolder: (name: string, parentId?: string | null) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  renameFolder: (id: string, name: string) => void;
  addToHistory: (fileId: string, progress: number) => Promise<void>;
  clearHistory: () => Promise<void>;
  getFilteredFiles: () => MediaFile[];
  getFilesInFolder: (folderId: string | null) => MediaFile[];
  refreshData: () => Promise<void>;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(mediaReducer, initialState);

  const refreshData = async () => {
    try {
      const [files, folders, history] = await Promise.all([
        api.getFiles(),
        api.getFolders(),
        api.getHistory()
      ]);
      dispatch({ type: 'SET_FILES', payload: files });
      dispatch({ type: 'SET_FOLDERS', payload: folders });
      dispatch({ type: 'SET_HISTORY', payload: history });
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addFile = async (file: File, folderId: string | null) => {
    try {
      const newFile = await api.uploadFile(file, folderId);
      dispatch({ type: 'ADD_FILE', payload: newFile });
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const deleteFile = async (id: string) => {
    try {
      await api.deleteFile(id);
      dispatch({ type: 'DELETE_FILE', payload: id });
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const updatedFile = await api.toggleFavorite(id);
      dispatch({ type: 'UPDATE_FILE', payload: updatedFile });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const addFolder = async (name: string, parentId: string | null = null) => {
    try {
      const newFolder = await api.createFolder(name, parentId);
      dispatch({ type: 'ADD_FOLDER', payload: newFolder });
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      await api.deleteFolder(id);
      dispatch({ type: 'DELETE_FOLDER', payload: id });
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const renameFolder = (id: string, name: string) => {
    dispatch({ type: 'RENAME_FOLDER', payload: { id, name } });
  };

  const addToHistory = async (fileId: string, progress: number) => {
    try {
      const historyItem = await api.addToHistory(fileId, progress);
      dispatch({ type: 'ADD_TO_HISTORY', payload: historyItem });
    } catch (error) {
      console.error('Failed to add to history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await api.clearHistory();
      dispatch({ type: 'CLEAR_HISTORY' });
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const getFilteredFiles = () => {
    let filtered = state.files;

    if (state.currentFolder !== null) {
      filtered = filtered.filter(f => f.folderId === state.currentFolder);
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(f => f.name.toLowerCase().includes(query));
    }

    if (state.filterType !== 'all') {
      filtered = filtered.filter(f => f.type === state.filterType);
    }

    return filtered;
  };

  const getFilesInFolder = (folderId: string | null) => {
    return state.files.filter(f => f.folderId === folderId);
  };

  return (
    <MediaContext.Provider
      value={{
        state,
        dispatch,
        addFile,
        deleteFile,
        toggleFavorite,
        addFolder,
        deleteFolder,
        renameFolder,
        addToHistory,
        clearHistory,
        getFilteredFiles,
        getFilesInFolder,
        refreshData,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
}
