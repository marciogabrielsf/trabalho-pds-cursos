export interface Student extends User {
    role: "student";
}

export interface Teacher extends User {
    role: "teacher";
}

export interface User {
    id: number;
    name: string;
    email: string;
}
