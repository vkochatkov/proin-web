import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IUserProject } from '../modules/types/mainProjects';
import { setCurrentProject } from '../modules/actions/mainProjects';

export const useOpenProjectLink = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenTheProject = (
    e: { stopPropagation: () => void },
    currentProject: IUserProject,
  ) => {
    e.stopPropagation();

    if (!currentProject) return;

    const linkURL = `/projects/${currentProject._id}`;

    dispatch(setCurrentProject(currentProject));
    navigate(linkURL);
  };

  return {
    handleOpenTheProject,
  };
};
