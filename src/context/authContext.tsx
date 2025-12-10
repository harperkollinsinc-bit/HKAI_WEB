import { serverUrl, USER, Workspace } from "@/lib/api";
import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const authContext = createContext();

export const useAuthContext = () => useContext(authContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<USER | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    authUser();
  }, []);

  async function authUser() {
    try {
      const response = await axios.get(`${serverUrl}/auth`, {
        withCredentials: true,
      });
      setUser(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <authContext.Provider
      value={{
        user,
        setUser,
        workspaces,
        setWorkspaces,
        activeVideo,
        setActiveVideo,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
