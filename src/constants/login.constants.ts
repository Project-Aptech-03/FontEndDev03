// src/pages/login/login.constants.ts
import { LoginErrors, LoginForm } from "../@type/login";

export const INITIAL_FORM_DATA: LoginForm = {
    email: "",
    password: "",
};

export const INITIAL_FORM_ERRORS: LoginErrors = {
    email: "",
    password: "",
    general: "",
};
