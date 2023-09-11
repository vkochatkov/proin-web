import React from 'react';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  getCurrentProject,
  getCurrentProjects,
  getSelectedProjectId,
} from '../../modules/selectors/mainProjects';
import { CustomSelect } from './CustomSelect';
import { Project } from '../../modules/reducers/mainProjects';
import { PROJECTS_PATH } from '../../config/routes';

interface IProps {
  handleChange: (e: SelectChangeEvent) => void;
  selectedValue: string;
}

export const ProjectSelect = ({ selectedValue, handleChange }: IProps) => {
  const selectedProjectId = useSelector(getSelectedProjectId);
  const location = useLocation();
  const isRoot = location.pathname === PROJECTS_PATH;
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

  return (
    <CustomSelect
      label={'Оберіть проект'}
      selectedValue={selectedValue}
      onChange={handleChange}
    >
      {!isRoot && <MenuItem value='В корінь'>В корінь</MenuItem>}
      {filtered.map((project: Project) => (
        <MenuItem key={project._id} value={project._id}>
          {project.projectName}
        </MenuItem>
      ))}
    </CustomSelect>
  );
};
