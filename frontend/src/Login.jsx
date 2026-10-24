import { useState } from "react";
import { useNavigate } from "./router.jsx";
import { IconBookOpen } from "./icons.jsx";
import { login } from "./api.js";

export default function Login() {
  const nav = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try { await login(u, p); nav("/home"); } catch (x) { setErr(x.message); }
  };

  return (
    <div className="login">
      <div className="login-box">
        <div className="login-top"><IconBookOpen size={38} /><h1>Bibliothèque</h1></div>
        <form onSubmit={submit} className="login-form">
          <label>Nom d'utilisateur<input value={u} onChange={(e) => setU(e.target.value)} autoFocus required /></label>
          <label>Mot de passe<input type="password" value={p} onChange={(e) => setP(e.target.value)} required /></label>
          {err && <p className="error">{err}</p>}
          <button className="btn primary">Se connecter</button>
        </form>
      </div>
    </div>
  );
}
