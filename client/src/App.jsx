import { useState } from "react";
import "./App.css";
import "./index.css";
import AnnouncementFormPage from "./AnnouncementFormPage";
import CategoryPage from "./CategoryPage";
import HomePage from "./HomePage";

export default function App() {
  const [page, setPage] = useState({ type: "home", category: null });
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Bicicletă de oraș, stare excelentă",
      price: "750",
      category: "Sport & Hobby",
      location: "Cluj-Napoca",
      contact: "Andrei Pop",
      description: "Bicicletă folosită ocazional, frâne noi și revizie completă.",
      imageUrl: "",
    },
    {
      id: 2,
      title: "Canapea extensibilă modernă",
      price: "1200",
      category: "Casă & Grădină",
      location: "București",
      contact: "Maria I.",
      description: "Perfectă pentru living, livrare rapidă în București.",
      imageUrl: "",
    },
    {
      id: 3,
      title: "Volkswagen Golf 6, 2012",
      price: "4200",
      category: "Auto & Moto",
      location: "Brașov",
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
          onSelectCategory={(category) =>
            setPage({ type: "category", category })
          }
        />
      )}
      {page.type === "create" && (
        <AnnouncementFormPage
          onAddAnnouncement={handleAddAnnouncement}
          onBackHome={() => setPage({ type: "home", category: null })}
          initialCategory={page.category}
        />
      )}
      {page.type === "category" && (
        <CategoryPage
          category={page.category}
          announcements={announcements}
          onAddAnnouncement={() => setPage({ type: "create", category: null })}
          onBackHome={() => setPage({ type: "home", category: null })}
        />
      )}
    </>
  );
}
