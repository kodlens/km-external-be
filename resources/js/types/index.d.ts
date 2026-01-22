export interface User {
	  data(data: any): unknown;
    id: number;
    user_id: number;
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




export interface PostLog {
    id: number;
    user_id: number;
    post_id: number;
    alias: string;
    description: string;
    action: string;
    created_at: Date;
    updated_at: Date;
}

export interface Permission {
    id: number;
    module_name: string;
    name: string;
    label: string;
    description: string;
}

export interface CategoryArticles {
    category_id: number;
    category: string;
    active: number;
    articles: Post[]
}


// cateogires
export interface Category {
	data(data: any): unknown;
    id: number;
    title: string;
    description: string;
    slug:string;
    active: boolean;
    created_at: Date,
    update_at: Date
}


//statuses
export interface Status extends StatusPair {
	// map(arg0: (item: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
	data(data: any): unknown;
    id: number;
    status: string;
    status_key: string;
    bgcolor: string;
    active: boolean;
}

//statuses
export interface StatusPair {
	// map(arg0: (item: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
	data(data: any): unknown;
    id: number;
    status_id: number;
    role_id: number;
}


//academic year
export interface Quarter {
	// map(arg0: (item: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
	data(data: any): unknown;
    id:number;
    quarter_name: string;
    is_active: number;
}

export interface Section {
	// map(arg0: (item: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    id:number;
	data(data: any): unknown;
    section: string;
    section_key: string;
    order_no: number;
    active: number;
}

export interface ArticleComment {
    data(data: any): unknown;
    comment_id: number;
    article_id: number;
    user_id: number;
    comment: string;
    article: {title:string};
    user: {lname:string, fname:string, mname:string};
}


// role
export interface Role {
	data(data: any): unknown;
    id: number;
    role: string;
    guard_name: string;
}

export interface RoleHasPermission {
	data(data: any): unknown;
    id: number;
    permission_id: number;
    permission: {
        label:string;
        name:string;
        description: string;
    }
    role_id: {
        role:string;
        guard_name:string;
    };
}


export interface Comments extends User {
	data(data: any): unknown;
    id: number;
    post_id:number;
    user_id:number;
    role:string;
    comments: string;
    created_at:Date;
}
export interface Template {
	data(data: any): unknown;
    id: number;
    template:string;
    created_at:Date;
    updated_at:Date;
}


export interface Page {
	data(data: any): unknown;
    id: number;
    title: string;
    description: string;
    slug: string;
    created_at:Date;
    updated_at:Date;
}

export interface Layout extends Section, Template, Page{
	data(data: any): unknown;
    id: number;
    page_id:number;
    section_id:number;
    template_id:string;
    created_at:Date;
    updated_at:Date;
}


export interface Layout {
	data(data: any): unknown;
    id: number;
    name:string;
    description:string;
    img:string;
    active:number;
    created_at:Date;
    updated_at:Date;
}


export interface Banner {
    id:number;
    active:number;
    data(data: any): unknown;
    name: string;
    description: string;
    img: string;
}

export interface PaginateResponse {
    data: any[];
    total: number;

}

export interface FeaturedVideo {
    id: number;
    data(data: any): unknown;
    total: number;
    link: string;
    description: string;
    order_no: number;
    title: string;
    excerpt: string;
    is_featured: number;
}


export interface Dostv {
    id: number;
    data(data: any): unknown;
    title: string;
    slug:string;
    description: string;
    featured_image:string;
    website:string;
    link: string;
    active: number;
    created_at:Date;
    updated_at:Date;
}
