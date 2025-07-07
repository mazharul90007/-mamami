import { Gender, InterestedIn, RelationshipStatus } from '../../../generated/prisma';

export type IUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  isActive: boolean;
  canChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
  otp?: string;
  otpExpiresAt?: Date;
  refreshToken?: string;
  gender?: Gender;
  interestedIn?: InterestedIn;
  heightFeet?: number;
  heightInches?: number;
  birthday?: Date;
  bio?: string;
  relationshipStatus?: RelationshipStatus;
  language?: string[];
  work?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  profilePhotoUrl?: string;
}

export type ICreateUser = {
  email: string;
  password: string;
  name: string;
  gender: Gender;
  interestedIn: InterestedIn;
  heightFeet: number;
  heightInches: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  profilePhotoUrl?: string;
  birthday?: string;
  bio?: string;
  relationshipStatus?: RelationshipStatus;
  language?: string[];
  work?: string;
};

export type ILoginUser = {
  email: string;
  password: string;
};

export type IUpdateUser = {
  name?: string;
  gender?: Gender;
  interestedIn?: InterestedIn;
  heightFeet?: number;
  heightInches?: number;
  birthday?: string;
  bio?: string;
  relationshipStatus?: RelationshipStatus;
  language?: string[];
  work?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  profilePhotoUrl?: string;
};

export type IUserResponse = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  canChangePassword: boolean;
  gender: Gender | null;
  interestedIn: InterestedIn | null;
  heightFeet: number | null;
  heightInches: number | null;
  birthday: Date | null;
  bio: string | null;
  relationshipStatus: RelationshipStatus | null;
  language: string[] | null;
  work: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  profilePhotoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
} 