import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio, video and image files are allowed'));
    }
  }
});

const DB_FILE = path.join(__dirname, 'db.json');

function readDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading DB:', e);
  }
  return { files: [], folders: [], history: [] };
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Get all files
app.get('/api/files', (req, res) => {
  const db = readDB();
  res.json(db.files);
});

// Upload file
app.post('/api/files', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const db = readDB();
    let fileType = 'image';
    if (req.file.mimetype.startsWith('audio/')) fileType = 'audio';
    else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
    
    const newFile = {
      id: uuidv4(),
      name: req.file.originalname,
      type: fileType,
      url: `/uploads/${req.file.filename}`,
      size: req.file.size,
      folderId: req.body.folderId || null,
      favorite: false,
      createdAt: new Date().toISOString()
    };

    db.files.push(newFile);
    writeDB(db);

    res.json(newFile);
  });
});

// Delete file
app.delete('/api/files/:id', (req, res) => {
  const db = readDB();
  const file = db.files.find(f => f.id === req.params.id);
  
  if (file) {
    const filePath = path.join(__dirname, 'uploads', path.basename(file.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    db.files = db.files.filter(f => f.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Toggle favorite
app.patch('/api/files/:id/favorite', (req, res) => {
  const db = readDB();
  const file = db.files.find(f => f.id === req.params.id);
  
  if (file) {
    file.favorite = !file.favorite;
    writeDB(db);
    res.json(file);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Get folders
app.get('/api/folders', (req, res) => {
  const db = readDB();
  res.json(db.folders);
});

// Create folder
app.post('/api/folders', (req, res) => {
  const db = readDB();
  const newFolder = {
    id: uuidv4(),
    name: req.body.name,
    parentId: req.body.parentId || null,
    createdAt: new Date().toISOString()
  };
  db.folders.push(newFolder);
  writeDB(db);
  res.json(newFolder);
});

// Delete folder
app.delete('/api/folders/:id', (req, res) => {
  const db = readDB();
  db.folders = db.folders.filter(f => f.id !== req.params.id);
  db.files = db.files.map(f => f.folderId === req.params.id ? { ...f, folderId: null } : f);
  writeDB(db);
  res.json({ success: true });
});

// History
app.get('/api/history', (req, res) => {
  const db = readDB();
  res.json(db.history);
});

app.post('/api/history', (req, res) => {
  const db = readDB();
  const entry = {
    id: uuidv4(),
    fileId: req.body.fileId,
    progress: req.body.progress || 0,
    playedAt: new Date().toISOString()
  };
  db.history.unshift(entry);
  if (db.history.length > 100) db.history = db.history.slice(0, 100);
  writeDB(db);
  res.json(entry);
});

app.delete('/api/history', (req, res) => {
  const db = readDB();
  db.history = [];
  writeDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
