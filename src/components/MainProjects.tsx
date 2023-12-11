import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListProjectItem } from './ListProjectItem';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules/store/store';
import {
  createNewProject,
  fetchAllUserProjects,
  fetchLimitedUserProjects,
  openCurrentProject,
  selectItemId,
  updateOrderProjects,
} from '../modules/actions/mainProjects';
import { startLoading } from '../modules/actions/loading';
import { PROJECTS_PATH } from '../config/routes';
import { Project } from '../modules/types/mainProjects';

interface IProps {}

export const MainProjects: React.FC<IProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allUserProjects, currentProject } = useSelector(
    (state: RootState) => state.mainProjects,
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const limit = 10;

  useEffect(() => {
    const getProjects = async () => {
      dispatch(fetchAllUserProjects() as any);
    };

    getProjects();
  }, [dispatch]);

  useEffect(() => {
    if (isPressed && currentProject && currentProject.status === 'success') {
      navigate(`${PROJECTS_PATH}/${currentProject._id}`);
      setIsPressed(false);
    }
  }, [currentProject, isPressed, navigate]);

  const fetchData = async () => {
    const nextPage = page + 1; // Calculate the next page number

    const projectsFromServer = await dispatch(
      fetchLimitedUserProjects(nextPage, limit) as any,
    );

    if (projectsFromServer.length === 0 || projectsFromServer.length < limit) {
      setHasMore(false);
    } else {
      setPage(nextPage); // Update the page for the next fetch
    }
  };

  const handleClickItem = (id: string) => {
    dispatch(startLoading());
    dispatch(openCurrentProject(id) as any);
    dispatch(selectItemId(id));
    navigate(`${PROJECTS_PATH}/${id}`);
  };

  const handleUpdateProjectOrder = (
    items: Project[],
    oldIndex: string,
    newIndex: string,
  ) => {
    dispatch(updateOrderProjects(items, newIndex) as any);
  };

  const handleCreateProject = () => {
    setIsPressed(true);
    dispatch(createNewProject() as any);
    dispatch(startLoading());
  };

  return (
    <ListProjectItem
      projects={allUserProjects}
      onClick={handleClickItem}
      updateOrder={handleUpdateProjectOrder}
      handleCreateProject={handleCreateProject}
      hasMore={hasMore}
      handleLoadMoreProjects={fetchData}
    />
  );
};
