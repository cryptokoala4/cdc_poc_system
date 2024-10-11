"use client";
import { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { useStaffStore } from "../store/staffStore";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "./LoadingSpinner";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      message
      staff {
        _id
        name
        username
        role
      }
    }
  }
`;

const testUsers = [
  {
    username: "htanaka",
    password: "pass01",
    name: "Hiroshi Tanaka",
    role: "Waiter",
  },
  { username: "ysato", password: "pass02", name: "Yuki Sato", role: "Waiter" },
  {
    username: "knakamura",
    password: "pass03",
    name: "Kenji Nakamura",
    role: "Waiter",
  },
  {
    username: "ayamamoto",
    password: "pass04",
    name: "Akiko Yamamoto",
    role: "Waiter",
  },
  {
    username: "tsuzuki",
    password: "pass05",
    name: "Takeshi Suzuki",
    role: "Manager",
  },
];

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const { currentStaff, setCurrentStaff } = useStaffStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay to show the loading spinner
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await login({ variables: { username, password } });
      if (data.login.success) {
        setCurrentStaff(data.login.staff);
      } else {
        alert(data.login.message);
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (user: (typeof testUsers)[0]) => {
    setUsername(user.username);
    setPassword(user.password);
  };

  if (isLoading || loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (currentStaff) return null; // Return null if user is already logged in

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-4xl w-full flex">
        <div className="w-1/2 pr-4 border-r border-gray-600">
          <h3 className=" font-semibold mb-4 text-white">Test Users</h3>
          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
            {testUsers.map((user) => (
              <button
                key={user.username}
                onClick={() => handleQuickLogin(user)}
                className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition duration-300"
              >
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-gray-300 ">
                  Username: {user.username}
                </p>
                <p className="text-gray-300 ">
                  Password: {user.password}
                </p>
                <p className="text-gray-400 ">{user.role}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="w-1/2 pl-4">
          <h2 className=" font-bold mb-6 text-white">Login</h2>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2 text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block mb-2 text-gray-300">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
