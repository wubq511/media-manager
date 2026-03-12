const API_BASE = import.meta.env.VITE_API_URL || 'https://media-manager-api-zups.onrender.com/api';

export const api = {
  async getFiles() {
    const res = await fetch(`${API_BASE}/files`);
    return res.json();
  },

  async uploadFile(file: File, folderId: string | null = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);
    
    const res = await fetch(`${API_BASE}/files`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  async deleteFile(id: string) {
    const res = await fetch(`${API_BASE}/files/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async toggleFavorite(id: string) {
    const res = await fetch(`${API_BASE}/files/${id}/favorite`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async getFolders() {
    const res = await fetch(`${API_BASE}/folders`);
    return res.json();
  },

  async createFolder(name: string, parentId: string | null = null) {
    const res = await fetch(`${API_BASE}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentId })
    });
    return res.json();
  },

  async deleteFolder(id: string) {
    const res = await fetch(`${API_BASE}/folders/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async getHistory() {
    const res = await fetch(`${API_BASE}/history`);
    return res.json();
  },

  async addToHistory(fileId: string, progress: number) {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, progress })
    });
    return res.json();
  },

  async clearHistory() {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'DELETE'
    });
    return res.json();
  }
};
