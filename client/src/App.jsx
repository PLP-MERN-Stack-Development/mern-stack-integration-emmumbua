import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import PostDetailsPage from './pages/PostDetailsPage.jsx';
import PostEditorPage from './pages/PostEditorPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:slug" element={<PostDetailsPage />} />
        <Route
          path="/admin/posts/new"
          element={(
            <ProtectedRoute roles={['admin', 'barista']}>
              <PostEditorPage mode="create" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/posts/:id/edit"
          element={(
            <ProtectedRoute roles={['admin', 'barista']}>
              <PostEditorPage mode="edit" />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/profile"
          element={(
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          )}
        />
        <Route path="/auth/:type" element={<AuthPage />} />
        <Route path="/admin" element={<Navigate to="/admin/posts/new" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
