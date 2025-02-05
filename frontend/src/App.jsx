import { useEffect, useState } from "react";
import "./App.css";

import { Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();

    try {
      // data is the token
      const { data } = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });

      // allows you to autologin whenever you refresh your page
      window.localStorage.setItem("token", data);

      const response = await axios.get("http://localhost:3000/account", {
        headers: {
          authorization: data,
        },
      });

      setUser(response.data);
      navigate("/account");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <h1>Login</h1>
      {error && <h5>{error}</h5>}
      <form onSubmit={login}>
        <input
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          placeholder="Password"
          value={password}
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <button>Login</button>
      </form>
    </>
  );
};

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();

    try {
      // data is the token
      const { data } = await axios.post("http://localhost:3000/register", {
        username,
        password,
      });

      // allows you to autologin whenever you refresh your page
      window.localStorage.setItem("token", data);

      const response = await axios.get("http://localhost:3000/account", {
        headers: {
          authorization: data,
        },
      });

      setUser(response.data);
      navigate("/account");
    } catch (error) {
      console.log(error.response.data.message);
    }
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
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <button>Register</button>
      </form>
    </>
  );
};

const Account = ({ user }) => {
  if (!user) {
    return <h1>You are not logged in</h1>;
  }

  return <h1>You are logged in as {user.username}</h1>;
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
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/account" element={<Account user={user} />} />
      </Routes>
    </>
  );
}

export default App;
