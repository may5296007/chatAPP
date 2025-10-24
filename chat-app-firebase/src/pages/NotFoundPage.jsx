import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4 mb-2">
          Page introuvable
        </h2>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button icon={Home}>
              Retour à l'accueil
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button variant="outline" icon={ArrowLeft}>
              Page précédente
            </Button>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;