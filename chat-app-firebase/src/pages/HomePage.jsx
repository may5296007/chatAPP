import { Link } from 'react-router-dom';
import { MessageCircle, Shield, Users, Zap } from 'lucide-react';
import Button from '../components/common/Button';

const HomePage = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Chat en temps réel',
      description: 'Échangez instantanément avec vos contacts en temps réel'
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Vos conversations sont protégées et sécurisées'
    },
    {
      icon: Users,
      title: 'Chat de groupe',
      description: 'Créez des discussions publiques et privées'
    },
    {
      icon: Zap,
      title: 'Ultra rapide',
      description: 'Messages instantanés sans latence'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Chat App</h1>
            </div>
            <div className="flex gap-4">
              <Link to="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button>Inscription</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Communiquez en toute simplicité
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Une application de chat moderne, sécurisée et facile à utiliser
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg">
                Commencer gratuitement
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <feature.icon className="text-blue-600 mb-4" size={40} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Prêt à commencer ?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez des milliers d'utilisateurs qui communiquent déjà sur Chat App
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Créer un compte gratuitement
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Chat App. Tous droits réservés.</p>
            <p className="mt-2 text-sm">
              Projet TP1 - Application de chat en ligne sécurisée
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;