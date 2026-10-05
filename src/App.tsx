import { Routes, Route } from 'react-router-dom';
import ScrollManager from './components/ScrollManager';
import Workbench from './components/Workbench';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

export default function App() {
  return (
    <>
      <ScrollManager />
      <Workbench>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </Workbench>
    </>
  );
}
