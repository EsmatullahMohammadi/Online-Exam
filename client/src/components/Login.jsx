/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";


function LoginPage() {
    
const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle Sign-In with Email and Password
  const handleEmailSignIn = async (e) => {
	e.preventDefault();
	setError('');

 };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    {/* Login Card */}
    <div className="bg-white p-8 rounded shadow-md w-full max-w-lg border">
      <h2 className="text-2xl font-bold text-center mb-6">Kabul Polytechnic Online Examination System</h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {/* Sign-In with Email and Password Form */}
      <form onSubmit={handleEmailSignIn}>
        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'} // Switch between 'text' and 'password' types
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 pr-10"
            placeholder="Enter your password"
            required
          />
          {/* Show/Hide Password Icon */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />} {/* Toggle icon based on state */}
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-sm hover:underline">
            Back to home
          </Link>
          <a href="/frogot-password" className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Login Button */}
        <button type="submit" className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
          Login
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm">
          Do not have an account?{' '}
          <Link to="/sign-up" className="text-blue-500 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
  );
}

export default LoginPage;
