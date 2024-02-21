export interface User {
  name: string;
  username: string;
  email: string;
  profileImage: string;
}

export interface Post {
  id: string;
  body: string;
  commentCount: number;
  name:string;
  username:string;
  profileImage:string;
  liked:boolean
  likedCount: number;
}

export interface Comment {
  id: string;
  body: string;
  name:string;
  username:string;
  profileImage:string;
}
