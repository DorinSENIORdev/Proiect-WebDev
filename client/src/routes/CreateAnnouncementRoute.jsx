import { useLocation } from "react-router-dom";
import AnnouncementFormPage from "../AnnouncementFormPage";
import { categories } from "../data/categories";

export default function CreateAnnouncementRoute(props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const requestedCategory = searchParams.get("category");
  const initialCategory = categories.some((category) => category.name === requestedCategory)
    ? requestedCategory
    : undefined;

  return <AnnouncementFormPage initialCategory={initialCategory} {...props} />;
}
