import { Gender, InterestedIn, IdType } from '../../../generated/prisma';

export type IUser = {
  id: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  isAccountVerified: boolean;
  imageVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  gender?: Gender;
  interestedIn?: InterestedIn;
  heightFeet?: number;
  heightInches?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  idType?: IdType;
  idPhotoUrl?: string;
  profilePhotoUrl?: string;
  emailVerifiedAt?: Date;
  accountVerifiedAt?: Date;
  imageVerifiedAt?: Date;
}

export type ICreateUser = {
  email: string;
  password: string;
};

export type IUpdateUserProfile = {
  gender?: Gender;
  interestedIn?: InterestedIn;
  heightFeet?: number;
  heightInches?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

export type IUpdateIdVerification = {
  idType: IdType;
  idPhotoUrl: string;
  profilePhotoUrl: string;
  imageVerified: boolean;
};

export type ILoginUser = {
  email: string;
  password: string;
};

export type IUserResponse = {
  id: string;
  email: string;
  isEmailVerified: boolean;
  isAccountVerified: boolean;
  imageVerified: boolean;
  gender: Gender | null;
  interestedIn: InterestedIn | null;
  heightFeet: number | null;
  heightInches: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  idType: IdType | null;
  idPhotoUrl: string | null;
  profilePhotoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
} 