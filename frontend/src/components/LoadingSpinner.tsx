const LoadingSpinner = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-white rounded-full animate-spin-slow"></div>
        <div className="absolute top-2 left-2 w-20 h-20 border-8 border-transparent border-t-blue-300 rounded-full animate-spin-reverse"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
