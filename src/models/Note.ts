export interface Content {
  id: string;
  header: string;
  content: string;
}

export interface Note {
  user: string; // always "DEFAULT" for now
  date: string; // "YYYYMMDD"
  contents: Content[];
}
