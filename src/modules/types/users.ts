export interface IFoundUser {
  name: string;
  email: string;
  id: string;
  projects: string[];
}

export interface IFoundUsers {
  foundUsers: IFoundUser[];
}
