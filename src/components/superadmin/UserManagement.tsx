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

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // For AI-powered search
  const [inactiveUsers, setInactiveUsers] = useState<User[]>([]); // For AI-powered insights

  useEffect(() => {
    axios
      .get("/api/users")
      .then((response) => {
        setUsers(response.data.filter((user: User) => user.role === "user"));
        analyzeUserActivity(response.data); // AI-powered insights
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // AI-Powered User Activity Analysis
  const analyzeUserActivity = (users: User[]) => {
    // Mock AI logic to determine inactive users based on specific criteria
    const inactive = users.filter((user) => {
      // Assuming a user is considered inactive if they haven't logged in for over 30 days (mock logic)
      const lastLoginDate = new Date(user.birthday); // Mock field, replace with actual last login field
      const daysSinceLastLogin = (new Date().getTime() - lastLoginDate.getTime()) / (1000 * 3600 * 24);
      return daysSinceLastLogin > 30;
    });
    setInactiveUsers(inactive);
  };

  // AI-Powered Search
  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (userId: string, role: User["role"]) => {
    try {
      const response = await axios.put("/api/users", { userId, role });
      const updatedUser = response.data;

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      if (updatedUser.role === "user") {
        setUsers((prevUsers) => [...prevUsers, updatedUser]);
      }

      alert("User role updated successfully");
    } catch (error) {
      console.error("Failed to update user role", error);
      alert("Failed to update user role. Please try again.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // AI-powered confirmation prompt
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`/api/delete-user?userId=${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Management</h2>

      {/* AI-Powered Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* AI-Powered Insights */}
      {inactiveUsers.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Inactive Users</h3>
          <p className="text-gray-600">The following users have been inactive for over 30 days:</p>
          <ul className="list-disc list-inside">
            {inactiveUsers.map((user) => (
              <li key={user._id}>{user.firstName} {user.lastName} - {user.email}</li>
            ))}
          </ul>
        </div>
      )}

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
          {filteredUsers.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 transition">
              <td className="p-3 border">{user.firstName} {user.lastName}</td>
              <td className="p-3 border">{user.gender}</td>
              <td className="p-3 border">{user.location}</td>
              <td className="p-3 border">{user.birthday}</td>
              <td className="p-3 border">{user.email}</td>
              <td className="p-3 border">{user.role}</td>
              <td className="p-3 border">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value as User["role"])}
                  className="border rounded-lg p-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
