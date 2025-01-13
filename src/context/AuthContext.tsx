import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({ username: "" });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState("exampleUser"); // 로그인 시 업데이트
  return (
    <AuthContext.Provider value={{ username }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
