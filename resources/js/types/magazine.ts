export interface Magazine {
	data(data: any): unknown;
    id: number;
    cover: string;
    title: string,
    slug: string,
    magazine_path: string;
    quarter: number;
    excerpt: string;
    year: number;
    is_featured: number;
    

}