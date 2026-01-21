export interface Subject {
  id: number;
  slug: string;
  subject: string;
  active: number;
  // Add other subject properties as needed
}



export interface SubjectHeading {
  id: number;
  subject_id: number;
  subject_heading: string;
  active: number;
  slug: string;
  // Add other subject heading properties as needed
}
