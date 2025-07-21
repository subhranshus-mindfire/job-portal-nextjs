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
import Image from "next/image";

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
        className={`fixed top-0 left-0 h-screen w-64 bg-white z-40 flex flex-col justify-between transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
      >
        <div>
          <div className="flex justify-between items-center px-6 py-5 text-2xl font-bold">
            <Link href="/">JobPortal</Link>
            <button
              className="lg:hidden text-2xl"
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

        {user ? (
          <div className="px-6 py-4 flex flex-col gap-2">
            <Link
              href="/my-profile"
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
        ) : (
          <div className="px-6 py-4 flex-col gap-2 flex md:hidden">
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
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col ml-0">
        <header className="fixed top-0 left-0 lg:left-64 w-full lg:w-[calc(100%-16rem)] bg-white px-6 py-4 flex justify-between items-center shadow z-20">


          <h1 className="font-bold text-3xl lg:hidden">Job Portal</h1>
          <button
            className="lg:invisible text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="fa fa-bars"></i>
          </button>
          {user ? (
            <div className="relative hidden lg:flex">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="font-medium text-gray-700 hover:text-gray-600  items-center"
              >

                <div>Hi, {user.name} <Image src={"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"} alt="Avatar" height={100} width={100} className="w-10 h-10 object-contain rounded-full inline" /></div>

              </button>
              {showProfileMenu && (
                <div className="absolute right-0 top-10 mt-2 w-40 bg-white border rounded shadow-lg flex flex-col">
                  <Link
                    href="/my-profile"
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
            <div className="gap-4 hidden lg:flex">
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

        <main className="flex-1 px-6 py-6 bg-gray-100 mt-10 lg:mt-14 lg:ml-64">{children}</main>

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
