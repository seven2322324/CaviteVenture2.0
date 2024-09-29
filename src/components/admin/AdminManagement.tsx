import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  location: string;
  birthday: string;
  email: string;
  role: "user" | "admin" | "superadmin";
}

const AdminManagement = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "", role: "admin" });
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [emailSuggestion, setEmailSuggestion] = useState<string>("");

  useEffect(() => {
    axios
      .get("/api/users")
      .then((response) => {
        setAdmins(response.data.filter((user: User) => user.role === "admin"));
      })
      .catch((error) => console.error("Error fetching admins:", error));
  }, []);

  const handleRoleChange = async (userId: string, role: User["role"]) => {
    try {
      const response = await axios.put("/api/users", { userId, role });
      const updatedUser = response.data;

      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== userId));
      if (updatedUser.role === "admin") {
        setAdmins((prevAdmins) => [...prevAdmins, updatedUser]);
      }

      alert("Admin role updated successfully");
    } catch (error) {
      console.error("Failed to update admin role", error);
      alert("Failed to update admin role");
    }
  };

  const handleDeleteAdmin = async (userId: string) => {
    try {
      await axios.delete(`/api/delete-user?userId=${userId}`);
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== userId));
      alert("Admin deleted successfully");
    } catch (error) {
      console.error("Failed to delete admin", error);
      alert("Failed to delete admin");
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/create-admin", newAdmin);
      alert("Admin created successfully");

      // Live update: Add the new admin to the list
      setAdmins((prevAdmins) => [...prevAdmins, response.data]);

      // Reset the form fields
      setNewAdmin({ email: "", password: "", role: "admin" });
      setPasswordStrength("");
      setEmailSuggestion("");
    } catch (error) {
      console.error("Failed to create admin", error);
      alert("Failed to create admin");
    }
  };

  // Basic AI for password strength feedback
  const evaluatePasswordStrength = (password: string) => {
    if (password.length < 6) {
      setPasswordStrength("Weak");
    } else if (password.length < 10) {
      setPasswordStrength("Moderate");
    } else {
      setPasswordStrength("Strong");
    }
  };

  // Basic AI for email suggestions
  const suggestEmailCorrection = (email: string) => {
    if (email && !email.includes("@")) {
      setEmailSuggestion("Did you mean to include '@'?");
    } else if (email && email.includes("@") && !email.includes(".")) {
      setEmailSuggestion("Did you mean to include a domain (e.g., '.com')?");
    } else {
      setEmailSuggestion("");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Admin Management</h2>
      <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700 font-medium">
          <tr>
            <th className="p-3 border">Full Name</th>
            <th className="p-3 border">Gender</th>
            <th className="p-3 border">Location</th>
            <th className="p-3 border">Birthday</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id} className="hover:bg-gray-50 transition">
              <td className="p-3 border">
                {admin.firstName} {admin.lastName}
              </td>
              <td className="p-3 border">{admin.gender}</td>
              <td className="p-3 border">{admin.location}</td>
              <td className="p-3 border">{admin.birthday}</td>
              <td className="p-3 border">{admin.email}</td>
              <td className="p-3 border">{admin.role}</td>
              <td className="p-3 border">
                <select
                  value={admin.role}
                  onChange={(e) => handleRoleChange(admin._id, e.target.value as User["role"])}
                  className="border rounded-lg p-2"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <button
                  onClick={() => handleDeleteAdmin(admin._id)}
                  className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleCreateAdmin} className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>
        <div>
          <label className="block text-lg font-medium mb-2">Email</label>
          <input
            type="email"
            value={newAdmin.email}
            onChange={(e) => {
              setNewAdmin({ ...newAdmin, email: e.target.value });
              suggestEmailCorrection(e.target.value);
            }}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
          {emailSuggestion && <p className="text-red-500 mt-1">{emailSuggestion}</p>}
        </div>
        <div>
          <label className="block text-lg font-medium mb-2">Password</label>
          <input
            type="password"
            value={newAdmin.password}
            onChange={(e) => {
              setNewAdmin({ ...newAdmin, password: e.target.value });
              evaluatePasswordStrength(e.target.value);
            }}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
          {passwordStrength && (
            <p className={`mt-1 ${passwordStrength === "Weak" ? "text-red-500" : passwordStrength === "Moderate" ? "text-yellow-500" : "text-green-500"}`}>
              Password Strength: {passwordStrength}
            </p>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
          Create Admin
        </button>
      </form>
    </div>
  );
};

export default AdminManagement;
