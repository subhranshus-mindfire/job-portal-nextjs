import React, { useState } from "react";
import api from "../services/api";
import { AxiosError } from "axios";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "@/context/AuthContext";

interface RegisterModalProps {
  onClose: () => void;
  setShowLoginModal: (val: boolean) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, setShowLoginModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"employer" | "applicant">("applicant");
  const [skills, setSkills] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { showAlert } = useAlert();
  const {setUser} =  useAuth()

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Name is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email address.";

    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!phoneRegex.test(phone)) newErrors.phone = "Invalid phone number.";

    if (role === "applicant" && !skills.trim()) newErrors.skills = "Skills are required for applicants.";

    if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";

    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        phone,
        password,
        role,
      });

      if (res.data.success && res.data.data && res.data.data._id) {
        const userId = res.data.data._id;

        if (role === "applicant") {
          await api.post("/applicants/", {
            user: userId,
            skills,
          });
        } else if (role === "employer") {
          await api.post("/employers/", {
            user: userId,
          });
        }

        onClose();
        showAlert("Registered successfully!", "success");
        setTimeout(async () => {
          try {
            const res = await api.get("/auth/me", { withCredentials: true });
            setUser(res.data);
          } catch {
            setUser(null);
          } 
        }, 3000);
      } else {
        showAlert("Registration failed!", "error");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (typeof error.response?.data?.message == "string")
        showAlert(error.response?.data?.message || "Something went wrong.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.4)] flex justify-center items-center z-40 register px-4 max-h-screen">
      <div className="bg-white rounded-xl p-8 w-full max-w-lg relative  max-h-[90vh] overflow-y-auto ">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full mb-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-500 mb-3">{errors.name}</p>}

          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full mb-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 mb-3">{errors.email}</p>}

          <label className="block mb-2 font-semibold">Phone</label>
          <input
            type="tel"
            placeholder="e.g. +91 1234567890"
            className="w-full mb-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <p className="text-red-500 mb-3">{errors.phone}</p>}

          <label className="block mb-2 font-semibold">Role</label>
          <select
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={role}
            onChange={(e) => setRole(e.target.value as "employer" | "applicant")}
          >
            <option value="applicant">Applicant</option>
            <option value="employer">Employer</option>
          </select>

          {role === "applicant" && (
            <>
              <label className="block mb-2 font-semibold">Skills</label>
              <input
                type="text"
                placeholder="e.g. JavaScript, React, Node.js"
                className="w-full mb-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
              {errors.skills && <p className="text-red-500 mb-3">{errors.skills}</p>}
            </>
          )}

          <label className="block mb-2 font-semibold">Password</label>
          <input
            type="password"
            placeholder="Create a strong password"
            className="w-full mb-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500 mb-3">{errors.password}</p>}

          <label className="block mb-2 font-semibold">Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter your password"
            className="w-full mb-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <p className="text-red-500 mb-4">{errors.confirmPassword}</p>}

          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
          >
            Register
          </button>

          <p className="text-gray-500 text-center mt-3">or Have an Account</p>

          <button
            onClick={() => {
              setShowLoginModal(true);
              onClose();
            }}
            type="button"
            className="w-full border border-gray-600 text-gray-600 rounded-full py-2 hover:bg-gray-100 mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
