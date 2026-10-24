import { Router, Navigate } from "./router.jsx";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import { ListPage, InfoPage, InsertPage, UpdatePage, DeletePage } from "./pages.jsx";

const Private = ({ children }) => (localStorage.getItem("token") ? children : <Navigate to="/login" />);

// L'ordre compte : les routes fixes passent avant « /:res ».
const routes = [
  { path: "/login", element: <Login /> },
  { path: "/home", element: <Private><Home /></Private> },
  { path: "/:res", element: <Private><ListPage /></Private> },
  { path: "/:res/insert", element: <Private><InsertPage /></Private> },
  { path: "/:res/info/:id", element: <Private><InfoPage /></Private> },
  { path: "/:res/update/:id", element: <Private><UpdatePage /></Private> },
  { path: "/:res/deleteform/:id", element: <Private><DeletePage /></Private> },
];

export default function App() {
  return <Router routes={routes} />;
}
