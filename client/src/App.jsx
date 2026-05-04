import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./components/AppContent";
import Footer from "./components/Footer";
import "./index.css";

export default function App() {
  return (
    <Router>
      <AppContent />
      <Footer />
    </Router>
  );
}
