import { Users } from "../@type/Users";

export const filterUsers = (users: Users[], search: string): Users[] => {
    const searchLower = search.toLowerCase();
    return users.filter((u) =>
        String(u.firstname || "").toLowerCase().includes(searchLower) ||
        String(u.lastname || "").toLowerCase().includes(searchLower) ||
        String(u.email || "").toLowerCase().includes(searchLower) ||
        String(u.phone || "").toLowerCase().includes(searchLower) ||
        String(u.address || "").toLowerCase().includes(searchLower)
    );
};

export const sortUsers = (
    users: Users[],
    sortBy: keyof Users,
    direction: "asc" | "desc"
): Users[] => {
    return users.sort((a, b) => {
        const aValue = a[sortBy] || "";
        const bValue = b[sortBy] || "";

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
    });
};
