// filepath: frontend/src/components/Auth/GoogleSignIn.jsx
function GoogleSignIn() {
  const handleClick = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Continue with Google
      </button>
    </div>
  );
}

export default GoogleSignIn;
