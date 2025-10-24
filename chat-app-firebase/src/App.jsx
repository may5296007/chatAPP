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

    <main className="flex-grow-1 container py-4">
      <div className="row justify-content-center">
        <section className="col-12 col-md-10 col-lg-8">
          <div className="chat-container p-3">
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