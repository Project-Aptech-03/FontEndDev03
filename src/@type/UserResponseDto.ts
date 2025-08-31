
export interface UsersResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
    avataUrl?: string;
    fullName?: string;
}

export interface UpdateProfileDto {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
    role?: string;
}