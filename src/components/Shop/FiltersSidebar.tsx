import React from 'react';
import { FaFilter } from 'react-icons/fa';
import { PRICE_RANGES } from '../../constants/filterOptions';
import {Category, Manufacturer} from "../../@type/products";


interface FiltersSidebarProps {
    categories: Category[];
    manufacturers: Manufacturer[];
    selectedCategories: string[];
    selectedPriceRange: string;
    selectedManufacturers: string[];
    onCategoryFilter: (category: string) => void;
    onPriceFilter: (range: string) => void;
    onManufacturerFilter: (manufacturer: string) => void;
}


const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
                                                           categories,
                                                           manufacturers,
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
                    {categories.map(category => (
                        <label key={category.id} className="filterOption">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.categoryName)}
                                onChange={() => onCategoryFilter(category.categoryName)}
                            />
                            {category.categoryName}
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

                {/* Manufacturers */}
                <div className="filterGroup">
                    <h4 className="filterGroupTitle">Manufacturer</h4>
                    {manufacturers.map(manufacturer => (
                        <label key={manufacturer.id} className="filterOption">
                            <input
                                type="checkbox"
                                checked={selectedManufacturers.includes(manufacturer.manufacturerName)}
                                onChange={() => onManufacturerFilter(manufacturer.manufacturerName)}
                            />
                            {manufacturer.manufacturerName}
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default FiltersSidebar;
