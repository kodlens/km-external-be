export interface User {
	  data(data: any): unknown;
    id: number;
    username: string,
    sex: string,
    name: string;
    lname: string;
    fname: string;
    mname: string;
    email: string;
    email_verified_at: string;
    active: boolean;
	  role: string;
}

export interface Encoder extends User {
    data(data: any): unknown;
    id: number;
    author: string;
    role: string;
    is_active: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        csrf_token: string;
    };
    categories?: string[];
    permissions?: string[];
    statuses?:Status[]
};



export interface PaginateResponse {
    data: any[];
    total: number;

}
