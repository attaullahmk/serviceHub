// src/components/Navbar/CategoryDropdown.jsx
// this dropdown component is used to display a list of categories and their subcategories in a dropdown format. It allows users to select a category and view its subcategories, which are linked to specific service pages.
// delete the code for clearer code
import { Link } from "react-router-dom";

const CategoryDropdown = ({ categories }) => {
  return (
    <div className="d-flex gap-4 mt-2">
      {categories.map((category, index) => (
        <div className="dropdown" key={index}>
          <button
            className="btn btn-light dropdown-toggle"
            type="button"
            id={`dropdownMenuButton-${index}`}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {category.name}
          </button>
          <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${index}`}>
            {category.subcategories.map((subcat, subIndex) => (
              <li key={subIndex}>
                <Link className="dropdown-item" to={`/services?category=${encodeURIComponent(subcat)}`}>
                  {subcat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CategoryDropdown;
