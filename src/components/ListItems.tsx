import React from 'react';
import { Project } from '../modules/reducers/mainProjects';
import { Item } from './Item';

interface Props {
  projects: Project[];
}

export const ListItems: React.FC<Props> = ({ projects }) => {
  return (
    <>
      {projects.map((project) => (
        <Item
          key={project._id}
          projectId={project._id}
          name={project.projectName}
          logo={project.logoUrl}
          description={project.description}
        />
      ))}
    </>
  );
};
