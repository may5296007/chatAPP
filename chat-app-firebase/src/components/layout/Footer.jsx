import { MessageCircle, Github, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="text-blue-600" size={28} />
              <span className="text-lg font-bold text-gray-900">Chat App</span>
            </div>
            <p className="text-sm text-gray-600">
              Application de chat en ligne sécurisée développée avec React et Firebase.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-gray-600 hover:text-blue-600">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/chat" className="text-sm text-gray-600 hover:text-blue-600">
                  Chat
                </a>
              </li>
              <li>
                <a href="/profile" className="text-sm text-gray-600 hover:text-blue-600">
                  Profil
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} />
                <span>support@chatapp.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Github size={16} />
                <a href="https://github.com" className="hover:text-blue-600">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} Chat App. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Projet TP1 - Application de chat en ligne sécurisée
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;