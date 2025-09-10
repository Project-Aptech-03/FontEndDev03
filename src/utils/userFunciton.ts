import { UsersResponseDto } from "../@type/UserResponseDto";


export const filterUsers = (users: UsersResponseDto[], search: string): UsersResponseDto[] => {
    const searchLower = search.toLowerCase();
    return users.filter((u) =>
        String(u.firstName || "").toLowerCase().includes(searchLower) ||
        String(u.lastName || "").toLowerCase().includes(searchLower) ||
        String(u.email || "").toLowerCase().includes(searchLower) ||
        String(u.phoneNumber || "").toLowerCase().includes(searchLower) ||
        String(u.address || "").toLowerCase().includes(searchLower)
    );
};

export const sortUsers = (
    users: UsersResponseDto[],
    sortBy: keyof UsersResponseDto,
    direction: "asc" | "desc"
): UsersResponseDto[] => {
    return users.sort((a, b) => {
        const aValue = a[sortBy] || "";
        const bValue = b[sortBy] || "";

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
    });
};
