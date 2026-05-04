import { useLocation, useParams } from "react-router-dom";
import CategoryPage from "../CategoryPage";
import NotFoundPage from "../pages/NotFoundPage";
import { findCategoryBySlug } from "../data/categories";

export default function CategoryRoute(props) {
  const { slug } = useParams();
  const location = useLocation();
  const category = slug ? findCategoryBySlug(slug) : null;

  if (!category) {
    return <NotFoundPage {...props} />;
  }

  return (
    <CategoryPage
      key={`${slug ?? "unknown"}:${location.search}`}
      {...props}
      category={category.name}
      onAddAnnouncement={() => props.onAddAnnouncement(category.name)}
    />
  );
}
