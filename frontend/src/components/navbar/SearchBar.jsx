import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, setSearchTerm, location, setLocation, handleSearch }) => (
  <form className="search-container mx-lg-4" onSubmit={handleSearch}>
    <div className="input-group search-input-group">
      <input
        type="text"
        className="form-control search-input"
        placeholder="search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <input
        type="text"
        className="form-control location-input"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button className="btn btn-primary search-button" type="submit">
        <Search size={20} />
      </button>
    </div>
  </form>
);

export default SearchBar;
