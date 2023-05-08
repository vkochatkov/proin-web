import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IProject } from '../../modules/types/mainProjects';
import { useSelector } from 'react-redux';
import {
  getAllUserProjects,
  getCurrentProject,
  getCurrentProjects,
  getSelectedProjectId,
} from '../../modules/selectors/mainProjects';
import { useLocation } from 'react-router-dom';
import { Project } from '../../modules/reducers/mainProjects';

interface IProps {
  onChange: (e: SelectChangeEvent) => void;
  selectedProject: string;
}

export const SelectComponent = ({ onChange, selectedProject }: IProps) => {
  const selectedProjectId = useSelector(getSelectedProjectId);
  const location = useLocation();
  const isRoot = location.pathname === '/';
  const openedProject = useSelector(getCurrentProject);
  const projects = useSelector(getCurrentProjects);

  const filtered = projects
    .filter((project) => {
      return projects.every((p) => {
        return !p.subProjects.includes(project._id);
      });
    })
    .filter((project) => project._id !== selectedProjectId)
    .filter((project) => {
      if (!openedProject) return true;
      else return project._id !== openedProject.id;
    });

  console.log('filtered', filtered);
  console.log('projects', projects);

  return (
    <FormControl variant="standard" sx={{ m: 1, width: '90%' }}>
      <InputLabel id="demo-simple-select-standard-label">
        Оберіть проект
      </InputLabel>
      <Select
        labelId="demo-simple-select-standard-label"
        id="component-simple"
        value={selectedProject}
        label="Оберіть проект"
        onChange={onChange}
        sx={{
          '& .MuiInputBase-input:focus': {
            background: 'transparent',
          },
        }}
      >
        {!isRoot && <MenuItem value="В корінь">В корінь</MenuItem>}
        {filtered.map((project: Project) => (
          <MenuItem key={project._id} value={project._id}>
            {project.projectName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
