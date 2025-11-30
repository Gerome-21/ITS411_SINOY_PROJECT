// types/memory.ts - COMPLETE UPDATED VERSION

import { ReactNode } from "react";

export interface User {
  id?: string;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  profileCompleted?: boolean;
  createdAt?: Date | any;
}

export interface Memory {
  id?: string;
  userId: string;
  title: string;
  description: string;
  dateOfMemory: Date | any;
  media: {
    type: 'image' | 'video' | 'audio';
    uri: string;
    fileName: string;
  }[];
  albumId: string;
  albumName: string;
  feeling: FeelingType;
  createdAt: Date | any;
}

export interface Album {
  id?: string;
  userId: string;
  name: string;
  memoryCount: number;
  createdAt: Date | any;
}

export interface SharedAlbum {
  id?: string;
  albumId: string;
  name: string;
  createdAt: Date | any;
  memoryCount: number;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  invitedEmails: string[]; // Emails that have been invited
  acceptedMembers: string[]; // User IDs of accepted members
  membersCount: number;
}

export interface AlbumInvitation {
  invitedUserName: ReactNode;
  id?: string;
  albumDocId: string;
  albumId: string;
  albumName: string;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  invitedUserId: string;
  invitedUserEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date | any;
  respondedAt?: Date | any;
}

export interface SharedMemory {
  id?: string;
  albumDocId: string;
  albumId: string;
  albumName: string;
  createdAt: Date | any;
  dateOfMemory: Date | any;
  description: string;
  feeling: FeelingType;
  media: {
    type: 'image' | 'video' | 'audio';
    uri: string;
    fileName: string;
  }[];
  title: string;
  userId: string;
  username: string;
}

export type FeelingType = 
  | 'happy' | 'excited' | 'grateful' | 'loved' | 'motivated' 
  | 'relaxed' | 'hopeful' | 'inspired' | 'proud' | 'bored' 
  | 'curious' | 'thoughtful' | 'nostalgic' | 'calm' | 'sad' 
  | 'angry' | 'anxious' | 'fear' | 'lonely' | 'confused' 
  | 'tired' | 'disappointed';

export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate?: () => Date;
  toMillis?: () => number;
}

export const isFirebaseTimestamp = (value: any): value is FirebaseTimestamp => {
  return value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value;
};

export const convertToDate = (timestamp: Date | FirebaseTimestamp | any): Date => {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (isFirebaseTimestamp(timestamp)) {
    return new Date(timestamp.seconds * 1000);
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return new Date();
};