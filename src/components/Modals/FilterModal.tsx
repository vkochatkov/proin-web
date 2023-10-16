import { useEffect, useState } from 'react';
import { DialogActions, DialogContent, SelectChangeEvent } from '@mui/material';
import { Modal } from './Modal';
import { Button } from '../FormElement/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getModalStateById } from '../../modules/selectors/modal';
import { RootState } from '../../modules/store/store';
import { closeModal } from '../../modules/actions/modal';
import { SelectComponent } from '../FormComponent/SelectComponent';
import { getAllUserProjects } from '../../modules/selectors/mainProjects';
import { IProject } from '../../modules/types/mainProjects';

interface IProps {
  submitHandler: (e: { preventDefault: () => void }, value: string) => void;
  modalId: string;
  label: string;
  itemsName: string;
}

const getProjectsNames = (projects: IProject[]) =>
  projects.reduce((accumulator: { id: string; value: string }[], project) => {
    const projectItem = {
      id: project._id as string,
      value: project.projectName as string,
    };

    accumulator.push(projectItem);

    if (project.subProjects && project.subProjects.length > 0) {
      const subprojectItems: { id: string; value: string }[] =
        project.subProjects.map((subProject) => ({
          id: subProject._id as string,
          value: subProject.projectName as string,
        }));
      accumulator.push(...subprojectItems);
    }

    return accumulator;
  }, []);

export const FilterModal: React.FC<IProps> = ({
  submitHandler,
  modalId,
  label,
  itemsName,
}) => {
  const dispatch = useDispatch();
  const valueFromSessionStorage = sessionStorage.getItem(
    `${itemsName}SelectedValue`,
  );
  const storedSelectedValue =
    valueFromSessionStorage !== null ? JSON.parse(valueFromSessionStorage) : '';

  const [selectedValue, setSelectedValue] = useState<string>(
    storedSelectedValue || '',
  );
  const userProjects = useSelector(getAllUserProjects) as IProject[];
  const usersProjectNames = getProjectsNames(userProjects);
  const open = useSelector((state: RootState) =>
    getModalStateById(state)(modalId),
  );

  useEffect(() => {
    sessionStorage.setItem(
      `${itemsName}SelectedValue`,
      JSON.stringify(selectedValue),
    );
  }, [selectedValue]);

  const handleClose = () => {
    dispatch(closeModal({ id: modalId }));
    setSelectedValue('');
  };

  const handleChangeValue = (e: SelectChangeEvent) => {
    const value = e.target.value;

    setSelectedValue(value);
  };

  return (
    <Modal open={open} handleClose={handleClose} label={label}>
      <form
        onSubmit={(e) => {
          submitHandler(e, selectedValue);
          dispatch(closeModal({ id: modalId }));
        }}
      >
        <DialogContent>
          <SelectComponent
            selectedValue={selectedValue}
            valuesArray={usersProjectNames}
            handleChange={handleChangeValue}
            style={{
              width: '100%',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedValue('')}>Очистити фільтр</Button>
          <Button type='submit'>Застосувати</Button>
        </DialogActions>
      </form>
    </Modal>
  );
};