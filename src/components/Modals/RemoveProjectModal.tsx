import { DialogActions, DialogContent } from '@mui/material';
import { Modal } from './Modal';
import { getModalStateById } from '../../modules/selectors/modal';
import { RootState } from '../../modules/store/store';
import { useSelector } from 'react-redux';
import { Button } from '../FormElement/Button';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../modules/actions/modal';
import {
  deleteCurrentProject,
  selectItemId,
  setCurrentProject,
  updateProjectsSuccess,
} from '../../modules/actions/mainProjects';
import {
  getCurrentProject,
  getCurrentProjects,
  getSelectedProjectId,
} from '../../modules/selectors/mainProjects';
import { getAuth } from '../../modules/selectors/user';
import { useParams } from 'react-router-dom';
import { Project } from '../../modules/types/mainProjects';

export const RemoveProjectModal = () => {
  const modalId = 'remove-project';
  const open = useSelector((state: RootState) =>
    getModalStateById(state)(modalId),
  );
  const dispatch = useDispatch();
  const projects = useSelector(getCurrentProjects);
  const projectToRemoveId = useSelector(getSelectedProjectId);
  const { token } = useSelector(getAuth);
  const { pid } = useParams();
  const currentProject = useSelector(getCurrentProject);

  const handleClose = () => {
    dispatch(closeModal({ id: modalId }));
    dispatch(selectItemId(''));
  };

  const submitHandler = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!projectToRemoveId) return;

    dispatch(deleteCurrentProject(token, projectToRemoveId) as any);

    let updatedProjectsList;

    if (pid && currentProject) {
      const updatedCurrentProject = JSON.parse(JSON.stringify(currentProject));
      updatedCurrentProject.subProjects = currentProject.subProjects.filter(
        (project: Project) => project.id !== projectToRemoveId,
      );

      updatedProjectsList = JSON.parse(JSON.stringify(projects));
      updatedProjectsList.forEach((p: Project) => {
        if (p.id === pid) {
          p.subProjects = p.subProjects.filter(
            (subproject: Project) => subproject.id !== projectToRemoveId,
          );
        }
      });

      dispatch(setCurrentProject(updatedCurrentProject));
    } else {
      updatedProjectsList = projects.filter(
        (project) => project._id !== projectToRemoveId,
      );
    }

    dispatch(updateProjectsSuccess(updatedProjectsList));
    dispatch(closeModal({ id: modalId }));
  };

  return (
    <Modal open={open} handleClose={handleClose} label={'Видалення проекту'}>
      <form onSubmit={submitHandler}>
        <DialogContent>
          Ви впевнені, що бажаєте видалити проект? Відновити його не буде
          можливим
        </DialogContent>
        <DialogActions>
          <Button type='submit'>Видалити</Button>
        </DialogActions>
      </form>
    </Modal>
  );
};
