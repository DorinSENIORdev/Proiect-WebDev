import { useState } from "react";
import "./index.css";
import AnnouncementFormPage from "./AnnouncementFormPage";
import CategoryPage from "./CategoryPage";
import Footer from "./components/Footer";
import HomePage from "./HomePage";

export default function App() {
  const [page, setPage] = useState({ type: "home", category: null });
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Bicicleta de oras, stare excelenta",
      price: "750",
      category: "Sport & Hobby",
      location: "Cluj-Napoca",
      contact: "Andrei Pop",
      description: "Bicicleta folosita ocazional, frane noi si revizie completa.",
      imageUrl: "",
    },
    {
      id: 2,
      title: "Canapea extensibila moderna",
      price: "1200",
      category: "Casa & Gradina",
      location: "Bucuresti",
      contact: "Maria I.",
      description: "Perfecta pentru living, livrare rapida in Bucuresti.",
      imageUrl: "",
    },
    {
      id: 3,
      title: "Volkswagen Golf 6, 2012",
      price: "4200",
      category: "Auto & Moto",
      location: "Brasov",
      contact: "Mihai R.",
      description: "Motor 1.6 TDI, consum redus, toate reviziile la zi.",
      imageUrl: "",
    },
  ]);

  const handleAddAnnouncement = (announcement) => {
    setAnnouncements((prev) => [announcement, ...prev]);
  };

  return (
    <>
      {page.type === "home" && (
        <HomePage
          onAddAnnouncement={() => setPage({ type: "create", category: null })}
          onGoHome={() => setPage({ type: "home", category: null })}
          onSelectCategory={(category) => setPage({ type: "category", category })}
        />
      )}
      {page.type === "create" && (
        <AnnouncementFormPage
          onAddAnnouncement={handleAddAnnouncement}
          onBackHome={() => setPage({ type: "home", category: null })}
          initialCategory={page.category}
          onGoHome={() => setPage({ type: "home", category: null })}
        />
      )}
      {page.type === "category" && (
        <CategoryPage
          category={page.category}
          announcements={announcements}
          onAddAnnouncement={() => setPage({ type: "create", category: null })}
          onBackHome={() => setPage({ type: "home", category: null })}
          onGoHome={() => setPage({ type: "home", category: null })}
        />
      )}
      <Footer />
    </>
  );
}
