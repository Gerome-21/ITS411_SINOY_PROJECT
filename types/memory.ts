// types/memory.ts
export interface Memory {
  id?: string;
  userId: string;
  title: string;
  description: string;
  dateOfMemory: Date;
  media: {
    type: 'image' | 'video' | 'audio';
    uri: string;
    fileName: string;
  }[];
  albumId: string; // Reference to album document
  albumName: string;
  feeling: FeelingType;
  createdAt: Date;
}

export interface Album {
  id?: string;
  userId: string;
  name: string;
  memoryCount: number;
  createdAt: Date;
}

export type FeelingType = 
  | 'happy' 
  | 'sad' 
  | 'loved' 
  | 'fear' 
  | 'surprised' 
  | 'inspired' 
  | 'bored';