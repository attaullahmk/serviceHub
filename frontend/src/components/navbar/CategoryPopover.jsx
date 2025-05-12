const CategoryPopover = ({ showCategoryPopover, setShowCategoryPopover, categories, handleCategorySelect, categoryPopoverRef }) => (
    <li className="nav-item position-relative" ref={categoryPopoverRef}>
      <button className="btn btn-primary btn-rounded" onClick={() => setShowCategoryPopover(prev => !prev)}>
        Categories
      </button>
      {showCategoryPopover && (
        <div className="popover-menu category-popover">
          {/* {categories.map((category, index) => (
            <button key={index} className="popover-item" onClick={() => handleCategorySelect(category)}>
              {category}
            </button>
          ))} */}
          {categories.map((category, index) => (
  <button
    key={index}
    className="dropdown-item d-flex align-items-center gap-2"
    onClick={() => handleCategorySelect(category.name)}
  >
    {category.icon}
    {category.name}
  </button>
))}

        </div>
      )}
    </li>
  );
  
  export default CategoryPopover;
  