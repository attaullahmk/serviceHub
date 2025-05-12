import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { FaTools, FaCar, FaHome, FaPaintRoller } from "react-icons/fa";
// import { MdElectricalServices } from "react-icons/md";
// import { BsFillPersonFill } from "react-icons/bs";
import "./CategoryMenu.css";
import { FaCaretDown } from "react-icons/fa";
import {
  FaUtensils,
  FaSeedling,
  FaCar,
  FaSpa,
  FaTools,
  FaTree,
  FaBroom,
  FaMotorcycle,
  FaFire,
  FaStar,
  FaCoffee,
  FaBriefcase,
  FaMoon,
  FaMugHot,
  FaTruckPickup,
  FaSprayCan,
  FaDumbbell,
  FaHandSparkles,
} from "react-icons/fa";
import { MdElectricalServices, MdLocalLaundryService } from "react-icons/md";

const CategoryMenu = ({
  showCategoryPopover,
  setShowCategoryPopover,
  handleCategorySelect,
  categoryPopoverRef,
}) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const categories = [
    {
      name: "Restaurants",
      icon: FaUtensils,
      subcategories: [
        { name: "Breakfast & Brunch", icon: FaCoffee },
        { name: "Lunch", icon: FaBriefcase },
        { name: "Dinner", icon: FaMoon },
        { name: "Coffee & Cafes", icon: FaMugHot },
        { name: "Takeout", icon: FaMotorcycle },
        { name: "Hot & Trendy", icon: FaFire },
        { name: "New Restaurants", icon: FaStar },
      ],
    },
    {
      name: "Home & Garden",
      icon: FaSeedling,
      subcategories: [
        { name: "Electricians", icon: MdElectricalServices },
        { name: "Plumbers", icon: FaTools },
        { name: "Landscaping", icon: FaTree },
        { name: "Cleaning Services", icon: FaBroom },
        { name: "Handyman", icon: FaTools },
        { name: "Pest Control", icon: FaSprayCan },
      ],
    },
    {
      name: "Auto Services",
      icon: FaCar,
      subcategories: [
        { name: "Mechanics", icon: FaTools },
        { name: "Car Wash", icon: MdLocalLaundryService },
        { name: "Towing", icon: FaTruckPickup },
        { name: "Auto Detailing", icon: FaSprayCan },
        { name: "Car Rentals", icon: FaCar },
      ],
    },
    {
      name: "Health & Beauty",
      icon: FaSpa,
      subcategories: [
        { name: "Spas", icon: FaSpa },
        { name: "Fitness", icon: FaDumbbell },
        { name: "Nail Salons", icon: FaHandSparkles },
        { name: "Massage", icon: FaSpa },
        { name: "Personal Trainers", icon: FaDumbbell },
      ],
    },
  ];

  const handleCategoryClick = (categoryName) => {
    setShowCategoryPopover(false);
    handleCategorySelect(categoryName);
  };

  return (
    <div className="category-links d-flex justify-content-center gap-4 mt-2">
      {categories.map((category, index) => (
        <div
          key={index}
          className="dropdown category-item hover-dropdown"
          onMouseEnter={() => {
            setShowCategoryPopover(true);
            setActiveCategory(index);
          }}
          onMouseLeave={() => {
            setShowCategoryPopover(false);
            setActiveCategory(null);
          }}
          ref={categoryPopoverRef}
        >
          {/* <span className="category-btn d-flex align-items-center gap-2">
            {category.icon && <category.icon size={18} />}
            {category.name}
          </span> */}
          <span className="category-btn d-flex align-items-center gap-2">
            {category.icon && <category.icon size={18} />}
            {category.name}
            <FaCaretDown size={14} className="text-muted" />
          </span>
          <ul
            className={`dropdown-menu ${
              showCategoryPopover && activeCategory === index ? "show" : ""
            }`}
          >
            {category.subcategories.map((sub, subIndex) => (
              <li key={subIndex}>
                {/* <button
                //   className="dropdown-item d-flex align-items-center gap-2"
                 className="dropdown-item rounded-1 d-flex align-items-center gap-2 px-3 py-2"
                  onClick={() => handleCategoryClick(sub.name)}
                >
                  {sub.icon && <sub.icon size={14} />}
                  {sub.name}
                </button> */}
                {/* // Update the subcategory button in CategoryMenu */}
                <button
                  className="dropdown-item rounded-1 d-flex align-items-center gap-2 px-3 py-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent event handlers
                    handleCategoryClick(sub.name);
                  }}
                >
                  {sub.icon && <sub.icon size={14} />}
                  {sub.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CategoryMenu;
