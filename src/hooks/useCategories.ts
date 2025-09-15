// hooks/useCategories.ts
import { useState, useEffect } from "react";
import {Category} from "../@type/products";
import {getCategory} from "../api/category.api";


export const useCategories = (pageNumber: number = 1, pageSize: number = 50, keyword?: string) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await getCategory(pageNumber, pageSize, keyword);

                if (res.success && res.data) {
                    setCategories(res.data.items);
                } else {
                    throw new Error(res.message || "Failed to fetch categories");
                }
            } catch (err: any) {
                setError(err.message || "Error fetching categories");
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [pageNumber, pageSize, keyword]);

    return { categories, loading, error };
};
