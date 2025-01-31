import { useEffect, useState } from "react";
import "./App.css";

import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  return <h1>Login</h1>;
};

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();

    // data is the token
    const { data } = await axios.post("http://localhost:3000/register", {
      username,
      password,
    });

    window.localStorage.setItem("token", data);

    const response = await axios.get("http://localhost:3000/account", {
      headers: {
        authorization: data,
      },
    });

    setUser(response.data);
    navigate("/account");
  };

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={register}>
        <input
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button>Register</button>
      </form>
    </>
  );
};

const Account = () => {
  return <h1>Account</h1>;
};

function App() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    const tryToLogin = async () => {
      if (token) {
        const response = await axios.get("http://localhost:3000/account", {
          headers: {
            authorization: token,
          },
        });

        setUser(response.data);
        navigate("/account");
      }
    };

    tryToLogin();
  }, []);

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/account" element={<Account user={user} />} />
      </Routes>
    </>
  );
}

export default App;
