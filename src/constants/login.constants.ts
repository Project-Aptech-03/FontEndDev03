// src/pages/login/login.constants.ts
import {LoginErrors, LoginForm, RegisterErrors} from "../@type/login";

export const INITIAL_FORM_DATA: LoginForm = {
    email: "",
    password: "",
};

export const INITIAL_FORM_ERRORS: LoginErrors = {
    email: "",
    password: "",
    general: "",
};
export const INITIAL_REGISTER_ERRORS: RegisterErrors = {
    email: "",
    password: "",
    general: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    confirmPassword: "",
}
// Trong file login.ts