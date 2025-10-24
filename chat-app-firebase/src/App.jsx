import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import AppRoutes from './routes/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

const Layout = () => (
  <div className="app-wrapper bg-light min-vh-100 d-flex flex-column">
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold text-primary" href="/">ChatApp</a>
      </div>
    </nav>

    <main className="flex-grow-1 container-fluid py-4">
      <div className="row g-4">
        <aside className="col-12 col-md-4 col-lg-3">
          <div className="sidebar p-3">
            <div className="mb-3">
              <input className="form-control" placeholder="Rechercher un contact..." />
            </div>
            <div className="contacts-list">
              {/* Liste de contacts dynamique — remplacez par votre composant qui mappe les contacts depuis le context ou la source de données */}
            </div>
          </div>
        </aside>

        <section className="col-12 col-md-8 col-lg-9">
          <div className="chat-container p-3">
            {/* AppRoutes rendra vos pages / composants de chat ici */}
            <AppRoutes />
          </div>
        </section>
      </div>
    </main>

    <footer className="bg-white text-center py-3 shadow-sm">
      <small className="text-muted">© ChatApp — Collège de Maisonneuve</small>
    </footer>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/*",
    element: <Layout />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <RouterProvider router={router} />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;