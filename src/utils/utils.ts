import { Project } from '../modules/reducers/mainProjects';

export const findProjectMember = (
  currentProject: Project | null,
  userId: string
) => {
  return currentProject
    ? Boolean(
        currentProject.sharedWith.find(
          (memberId: string) => memberId === userId
        )
      )
    : false;
};
