
export interface LoginForm {
    email: string;
    password: string;
}

export interface LoginErrors {
    email: string;
    password: string;
    general: string;
}
// Trong file login.ts
export interface RegisterErrors {
    email?: string;
    password?: string;
    general?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
    confirmPassword?: string;
}