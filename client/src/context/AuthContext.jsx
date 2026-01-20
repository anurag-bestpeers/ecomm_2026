import api from "../utils/axios";
import { createContext, useEffect, useState } from "react"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false);
  }, [])

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password
      })
      const data = await response.data.data;
      setUser(data)
      localStorage.setItem("user", JSON.stringify(data));
      return {
        success: true,
        message: 'Registration successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password
      })
      const data = await response.data.data;
      setUser(data)
      localStorage.setItem("user", JSON.stringify(data));
      return {
        success: true,
        message: 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  }

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthContext;
