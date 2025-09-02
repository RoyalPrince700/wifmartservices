// filepath: frontend/src/pages/Dashboard.jsx
import { useContext } from 'react';
import { AuthContext } from '../../src/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  console.log('Dashboard user:', user); // Add this line

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg mb-4">Welcome, {user.name}!</p>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;