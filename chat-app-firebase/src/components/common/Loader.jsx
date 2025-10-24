const Loader = ({ size = 'md', text = 'Chargement...', fullScreen = false }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const content = (
    <div className="text-center">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizes[size]} mx-auto`}></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;