"use client";
import { createContext, useContext, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ModalContext = createContext<any>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  return (
    <ModalContext.Provider
      value={{ showLoginModal, setShowLoginModal, showRegisterModal, setShowRegisterModal, showJobModal, setShowJobModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
