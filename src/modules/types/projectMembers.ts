export interface IMember {
  role: string;
  status: string;
  userId: string;
  name: string;
  email: string;
}

export interface IMembers {
  projectMembers: IMember[];
}
