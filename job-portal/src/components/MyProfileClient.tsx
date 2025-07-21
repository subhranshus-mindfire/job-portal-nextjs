"use client";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function MyProfileClient({ user }: { user: User }) {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white shadow rounded p-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <p className="text-gray-900">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <p className="text-gray-900">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
