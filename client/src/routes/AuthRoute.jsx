import { useLocation } from "react-router-dom";
import AuthPage from "../AuthPage";

export default function AuthRoute(props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultMode = searchParams.get("mode") === "register" ? "register" : "login";

  return <AuthPage defaultMode={defaultMode} {...props} />;
}
