import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MediaProvider } from './contexts/MediaContext';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/Home/Home';
import Favorites from './pages/Favorites/Favorites';
import History from './pages/History/History';
import './App.css';

function App() {
  return (
    <MediaProvider>
      <BrowserRouter>
        <div className="app">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </MediaProvider>
  );
}

export default App;
