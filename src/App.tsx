import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EditorPage from '@/pages/EditorPage';
import CommunityPage from '@/pages/CommunityPage';
import Navbar from '@/components/common/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-bg-deep">
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route
              path="/library"
              element={<div className="p-8 text-center text-xl text-white">素材库页面 - 建设中</div>}
            />
            <Route
              path="/works"
              element={<div className="p-8 text-center text-xl text-white">我的作品页面 - 建设中</div>}
            />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
