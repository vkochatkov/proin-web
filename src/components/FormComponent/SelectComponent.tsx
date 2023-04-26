import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IProject } from '../../modules/types/mainProjects';
import { useSelector } from 'react-redux';
import {
  getAllUserProjects,
  getSelectedProjectId,
} from '../../modules/selectors/mainProjects';
import { useLocation } from 'react-router-dom';

interface IProps {
  onChange: (e: SelectChangeEvent) => void;
  selectedProject: string;
}

export const SelectComponent = ({ onChange, selectedProject }: IProps) => {
  const currentProjectId = useSelector(getSelectedProjectId);
  const location = useLocation();
  const isRoot = location.pathname === '/';

  const projects = useSelector(getAllUserProjects);
  const filtered = projects
    .filter((project) => {
      return projects.every((p) => {
        return !p.subProjects.includes(project._id);
      });
    })
    .filter((project) => {
      return project._id !== currentProjectId;
    });

  return (
    <FormControl variant="standard" sx={{ m: 1, width: '90%' }}>
      <InputLabel id="demo-simple-select-standard-label">
        Оберіть проект
      </InputLabel>
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={selectedProject}
        label="Оберіть проект"
        onChange={onChange}
      >
        {!isRoot && <MenuItem value="В корінь">В корінь</MenuItem>}
        {filtered.map((project: IProject) => (
          <MenuItem key={project._id} value={project._id}>
            {project.projectName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
