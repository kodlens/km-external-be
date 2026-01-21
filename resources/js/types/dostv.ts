export interface Dostv {
  id: number;
  data(data: any): unknown;
  title?: string;
  slug?: string;
  description: string;
  featured_image: string;
  website: string;
  link: string;
  active: number;
  created_at: Date;
  updated_at: Date;
}

export interface DostvVideo {
  id?: number;
  title?: string;
  description?:string;
  link:string;
  order_no:number;
  is_featured: number;
  active: number;
  created_at: Date;
  updated_at: Date;
}