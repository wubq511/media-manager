export type MediaType = 'audio' | 'video' | 'image';

export interface MediaFile {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  size: number;
  duration?: number;
  thumbnail?: string;
  folderId: string | null;
  favorite: boolean;
  createdAt: Date;
  lastPlayedAt?: Date;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
}

export interface PlayHistory {
  id: string;
  fileId: string;
  playedAt: Date;
  progress: number;
}

export interface MediaState {
  files: MediaFile[];
  folders: Folder[];
  history: PlayHistory[];
  currentFolder: string | null;
  searchQuery: string;
  filterType: MediaType | 'all';
}

export type MediaAction =
  | { type: 'SET_FILES'; payload: MediaFile[] }
  | { type: 'ADD_FILE'; payload: MediaFile }
  | { type: 'DELETE_FILE'; payload: string }
  | { type: 'UPDATE_FILE'; payload: MediaFile }
  | { type: 'SET_FOLDERS'; payload: Folder[] }
  | { type: 'ADD_FOLDER'; payload: Folder }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'RENAME_FOLDER'; payload: { id: string; name: string } }
  | { type: 'SET_CURRENT_FOLDER'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTER_TYPE'; payload: MediaType | 'all' }
  | { type: 'SET_HISTORY'; payload: PlayHistory[] }
  | { type: 'ADD_TO_HISTORY'; payload: PlayHistory }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'LOAD_STATE'; payload: Partial<MediaState> };
