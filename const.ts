export const SEPARATOR = ' ';

export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Check your login or password',
  USER_NOT_FOUND: 'Such user does not exist',
  CHECK_TOKEN: 'Check token and permissions',
  NOT_ARRAY: 'Field is not an array',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const FORMATS = {
  CSV: 'csv',
  JSON: 'json',
};

export const ADMIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzFiYzQzZTlhMDlhYWU3YzllYzhhMyIsImVtYWlsIjoiTWVsdmluLktyZWlnZXJAaG90bWFpbC5jb20iLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MDMxNjkyOTJ9.rL6aIIw2GHO7mGb1Ed1E86CR9Pg7OA_m0Lm610QiOyU';

export const USER_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NzFjNmNhOWE0OGM5ZDZmMTRhMTk4ZCIsImVtYWlsIjoiTWVsZ2VyQGhvdG1haWwuY29tIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3MDMxNjk0NjF9.z0WWE621XoFV85G_sGjqSxHtu87s9sosIeicSkTGtQU';

export const SUBJECT = 'Information from Movie App';

export type Filter = {
  format: string | undefined;
};

export type Payload = {
  id: string;
  email: string;
  roles: string[];
};
