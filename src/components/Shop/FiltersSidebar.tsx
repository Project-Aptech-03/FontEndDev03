import React from 'react';
import { FaFilter } from 'react-icons/fa';
import { CATEGORIES, PRICE_RANGES, MANUFACTURER } from '../../constants/filterOptions';

interface FiltersSidebarProps {
  selectedCategories: string[];
  selectedPriceRange: string;
  selectedManufacturers: string[];
  onCategoryFilter: (category: string) => void;
  onPriceFilter: (range: string) => void;
  onManufacturerFilter: (manufacturer: string) => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  selectedCategories,
  selectedPriceRange,
  selectedManufacturers,
  onCategoryFilter,
  onPriceFilter,
  onManufacturerFilter
}) => {
  return (
    <aside className="filters">
      <div className="filterSection">
        <h3 className="filterTitle">
          <FaFilter /> Filters
        </h3>
        
        {/* Categories */}
        <div className="filterGroup">
          <h4 className="filterGroupTitle">Categories</h4>
          {CATEGORIES.map(category => (
            <label key={category} className="filterOption">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => onCategoryFilter(category)}
              />
              {category}
            </label>
          ))}
        </div>

        {/* Price Range */}
        <div className="filterGroup">
          <h4 className="filterGroupTitle">Price Range</h4>
          {PRICE_RANGES.map(range => (
            <label key={range.value} className="filterOption">
              <input
                type="radio"
                name="priceRange"
                value={range.value}
                checked={selectedPriceRange === range.value}
                onChange={() => onPriceFilter(range.value)}
              />
              {range.label}
            </label>
          ))}
        </div>

        {/* Manufacturer */}
        <div className="filterGroup">
          <h4 className="filterGroupTitle">Manufacturer</h4>
          {MANUFACTURER.map(manufacturer => (
            <label key={manufacturer} className="filterOption">
              <input
                type="checkbox"
                checked={selectedManufacturers.includes(manufacturer)}
                onChange={() => onManufacturerFilter(manufacturer)}
              />
              {manufacturer}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
