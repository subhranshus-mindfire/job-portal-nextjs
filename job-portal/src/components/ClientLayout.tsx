"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import JobModal from "./JobModal";
import Alert from "./Alert";
import { AlertProvider } from "@/context/AlertContext";
import { ModalProvider, useModal } from "@/context/ModalContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AlertProvider>
        <ModalProvider>
          <LayoutShell>{children}</LayoutShell>
        </ModalProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

function LayoutShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const { showLoginModal, setShowLoginModal, showRegisterModal, setShowRegisterModal, showJobModal, setShowJobModal } = useModal();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logOut = () => {
    router.push("/");
    setTimeout(() => logout(), 100);
  };

  const isActive = (path: string) =>
    pathname === path
      ? "flex items-center gap-2 p-2 rounded text-black bg-gray-300 font-semibold"
      : "flex items-center gap-2 p-2 rounded text-gray-700 hover:bg-gray-200";

  return (
    <div className="min-h-screen flex">
      <Alert />

      <aside
        className={`fixed md:relative h-full md:h-screen z-35 top-0 left-0 w-64 bg-white flex flex-col justify-between transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div>
          <div className="flex justify-between items-center px-6 py-5 text-2xl font-bold">
            <Link href="/">JobPortal</Link>
            <button
              className="md:hidden text-2xl"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col px-6 py-4 space-y-1 text-base font-medium">
            <Link href="/" className={isActive("/")}>
              <i className="fa fa-home"></i> Home
            </Link>

            {user?.role === "employer" && (
              <Link href="/my-jobs" className={isActive("/my-jobs")}>
                <i className="fa fa-briefcase"></i> My Jobs
              </Link>
            )}

            {user?.role === "applicant" && (
              <Link href="/my-applications" className={isActive("/my-applications")}>
                <i className="fa fa-list"></i> My Applications
              </Link>
            )}
          </nav>
        </div>

        {user && (
          <div className="px-6 py-4 flex flex-col gap-2">
            <Link
              href="/account"
              className="flex items-center gap-2 p-2 rounded text-gray-700 hover:bg-gray-200"
            >
              <i className="fa fa-user"></i> My Profile
            </Link>
            <button
              onClick={logOut}
              className="flex items-center gap-2 p-2 rounded text-gray-700 hover:bg-gray-200 text-left"
            >
              <i className="fa fa-sign-out-alt"></i> Logout
            </button>
          </div>
        )}
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col ml-0">
        <header className="bg-white px-6 py-4 flex justify-between items-center shadow">
          <button
            className="md:invisible text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="fa fa-bars"></i>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="font-medium text-gray-700 hover:text-gray-600"
              >
                Hi, {user.name} ▼
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg flex flex-col">
                  <Link
                    href="/account"
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    My Account
                  </Link>
                  <button
                    onClick={logOut}
                    className="px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="border-2 border-gray-600 text-gray-600 px-4 py-2 rounded-full hover:border-gray-700"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="border bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700"
              >
                Register
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 px-6 py-6 bg-gray-100">{children}</main>

        <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600">
          &copy; 2025 JobPortal. All rights reserved.
        </footer>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          setShowRegisterModal={setShowRegisterModal}
        />
      )}

      {showJobModal && user?.role === "employer" && (
        <JobModal
          employerId={user.role_id}
          onClose={() => setShowJobModal(false)}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          setShowLoginModal={setShowLoginModal}
        />
      )}
    </div>
  );
}
