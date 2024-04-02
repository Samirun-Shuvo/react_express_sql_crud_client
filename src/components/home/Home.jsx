import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setUsers(json);
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleUserDelete = (id) => {
    const proceed = window.confirm("Are you sure you want to delete?");
    if (proceed) {
      fetch(`http://localhost:5000/api/user/${id}`, { method: "DELETE" })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((json) => {
          if (json.status === "success") {
            alert("User deleted successfully.");
            const remainingUsers = users.filter((user) => user.id !== id);
            setUsers(remainingUsers);
          } else {
            alert("Failed to delete user.");
          }
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
          alert("Error deleting user. See console for more details.");
        });
    }
  };

  return (
    <div>
      <Link to="/">Home</Link> || <Link to="/adduser">Add User</Link>
      <div>
        <h3>Available users: {users.length}</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} -- {user.email} --{" "}
              <Link to={`/updateuser/${user.id}`}>Update</Link>
              <button onClick={() => handleUserDelete(user.id)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
