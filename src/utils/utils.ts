import { Project } from '../modules/reducers/mainProjects';

export const findProjectMember = (
  currentProject: Project | null,
  userId: string
) => {
  if (!currentProject) return false;

  return currentProject
    ? Boolean(
        currentProject.sharedWith.find(
          (memberId: string) => memberId === userId
        )
      )
    : false;
};
