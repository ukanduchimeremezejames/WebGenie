import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Datasets } from './pages/Datasets';
import { DatasetPage } from './pages/DatasetPage';
import { Compare } from './pages/Compare';
import { Explorer } from './pages/Explorer';
import { Upload } from './pages/Upload';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/datasets/*" element={<Datasets />} />
            <Route path="/dataset/:id" element={<><DatasetPage /></>} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/compare/*" element={<Compare />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/explorer/*" element={<Explorer />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/upload/*" element={<Upload />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
