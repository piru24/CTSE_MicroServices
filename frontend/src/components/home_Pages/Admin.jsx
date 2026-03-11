import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdAdminPanelSettings, MdOutlineRestaurantMenu } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
axios.defaults.withCredentials = true;

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("http://food-app.127.0.0.1.nip.io/user/users", { withCredentials: true });
        const users = response.data.users.map((user) => ({
          id: user._id,
          name: user.name,
          address: user.address,
          phone: user.mobile,
          email: user.email,
          role: user.role,
        }));
        setUsers(users);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);

  const roleColors = {
    admin: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900",
    seller: "bg-gradient-to-r from-green-400 to-green-600 text-green-900",
    buyer: "bg-gradient-to-r from-blue-200 to-blue-400 text-blue-900",
    delivery: "bg-gradient-to-r from-purple-300 to-purple-500 text-purple-900"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      {/* Header */}
      <header className="bg-white/90 shadow-md py-6 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <MdAdminPanelSettings className="text-4xl text-green-600" />
            <h1 className="text-3xl font-extrabold text-green-800 tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <Link
            to="./viewOrders"
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-full font-bold shadow hover:from-green-600 hover:to-green-800 transition flex items-center gap-2"
          >
            <MdOutlineRestaurantMenu className="text-xl" />
            View Orders
          </Link>
        </div>
      </header>

      {/* Users Table */}
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <FaUserAlt className="text-2xl text-green-600" />
          <h2 className="text-2xl font-bold text-green-800">All Users</h2>
        </div>

        <div className="overflow-x-auto bg-white/90 rounded-2xl shadow-2xl border border-green-100">
          <table className="min-w-full">
            <thead className="bg-green-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Address</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-50">
              {users.map((user, key) => (
                <tr key={key} className="hover:bg-green-50 transition">
                  <td className="px-6 py-4 text-sm text-green-700 font-mono">{user.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-green-900 font-semibold">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-green-900">{user.address}</td>
                  <td className="px-6 py-4 text-sm text-green-900">{user.phone}</td>
                  <td className="px-6 py-4 text-sm text-green-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-4 py-1 rounded-full font-bold shadow text-xs ${roleColors[user.role] || "bg-gray-100 text-gray-800"}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Admin;
