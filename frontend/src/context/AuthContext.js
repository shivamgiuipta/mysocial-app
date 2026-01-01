import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const API_URL = "https://mysocial-app-zltd.onrender.com/api";

  const register = async (username, email, password) => {
  const res = await api.post("/auth/register", {
    username,
    email,
    password,
  });
  return res.data;
};



  return (
    <AuthContext.Provider value={{ user, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

