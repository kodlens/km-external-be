import { User } from ".";
import { InfoSubjectHeading } from ".";

export interface Info  {
    data(data: any): unknown;
    id: number;
    source_id?: number;
    title?: string;
    excerpt?: string;
    description?: string;
    description_text?: string;
    alias?: string;
    subjects: InfoSubjectHeading[]


    thumbnail?: string;
    tags: string;
    status: string;

    source_key?: string;
    source_url?: string;
    content_type?: string;

    region?: string;
    agency?: string;

    is_publish?: string;
    publish_date?: string | Date;
    material_type?: string;
    catalog_date?: string;
    author_name?: string;
    subject_headings?: string;
    publisher_name?: string;

    encoded_by?:number
    encoded_by_name?:User
    encoded_at?:string | Date
    last_updated_by?:number
    last_updated_by_name?:User
    last_updated_at?:string | Date

    record_trail?: string;
    trash?: string | number;
}


export interface InfoSubjectHeading  {
    id: number;
    info_id: number;
    subject_id: number;
    subject_heading_id: number;
    score?: number;
    analysis?: string;
    subject?: string;
    subject_heading?: string;
}

