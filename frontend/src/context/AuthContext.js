import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const API_URL = "https://mysocial-app-zltd.onrender.com/api";

  const register = async (username, email, password) => {
    console.log("REGISTER API CALL"); 

    const response = await axios.post(
      `${API_URL}/auth/register`,
      { username, email, password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  };
  

  return (
    <AuthContext.Provider value={{ user, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

