// filepath: frontend/src/pages/SignIn.jsx
import GoogleSignIn from '../components/Auth/GoogleSignIn.jsx';

function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to Wifmart</h1>
      <p className="text-lg mb-4">Sign in to start connecting with service providers</p>
      <GoogleSignIn />
    </div>
  );
}

export default SignIn;