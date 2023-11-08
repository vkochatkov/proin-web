import { MenuItem, SelectChangeEvent } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { CustomSelect } from './CustomSelect';
import { PROJECTS_PATH } from '../../config/routes';
import { Project } from '../../modules/types/mainProjects';

interface IProps {
  handleChange: (e: SelectChangeEvent) => void;
  selectedValue: string;
  projects: Project[];
  withRootMenuItem?: boolean;
}

export const ProjectSelect = ({
  selectedValue,
  handleChange,
  projects,
  withRootMenuItem = false,
}: IProps) => {
  const location = useLocation();
  const isRoot = location.pathname === PROJECTS_PATH;

  return (
    <CustomSelect
      label={'Оберіть проект'}
      selectedValue={selectedValue}
      onChange={handleChange}
    >
      {!isRoot && withRootMenuItem && (
        <MenuItem value='В корінь'>В корінь</MenuItem>
      )}
      {projects.map((project: Project) => (
        <MenuItem key={project._id} value={project._id}>
          {project.projectName}
        </MenuItem>
      ))}
    </CustomSelect>
  );
};
