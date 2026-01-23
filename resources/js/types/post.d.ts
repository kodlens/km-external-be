export interface Post {
    data(data: any): unknown;
    id: number;
    source_id?: number;
    title?: string;
    excerpt?: string;
    description?: string;
    description_text?: string;
    alias?: string;
    subjects: InfoSubjectHeading[]
    url?: string;
    agency_code?: string;
    thumbnail?: string;
    tags?: string[];
    status?: string;
    source?: string;
    source_url?: string;
    content_type?: string;
    region?: string;
    agency?: string;
    regional_office?: string;
    is_publish?: string;
    publish_date?: string | Date;
    material_type?: string;
    catalog_date?: string;
    author_name?: string;
    subject_headings?: string;
    publisher_name?: string;
    submittcategoryed_date?: string;
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

