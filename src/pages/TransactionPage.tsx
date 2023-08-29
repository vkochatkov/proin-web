import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InteractiveInput } from '../components/FormComponent/InteractiveInput';
import { Card } from '../components/UIElements/Card';
import { useForm } from '../hooks/useForm';
import { Header } from '../components/Navigation/Header';
import { Button } from '../components/FormElement/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { setTabValue } from '../modules/actions/tabs';
import { getCurrentTransaction } from '../modules/selectors/currentTransaction';
import { TransactionSelect } from '../components/FormComponent/TransactionSelect';
import { SnackbarUI } from '../components/UIElements/SnackbarUI';
import { getTransactionLabel } from '../utils/utils';
import { AddClassifierInputComponent } from '../components/FormComponent/AddClassifierInputComponent';
import {
  fetchTransactionById,
  updateTransactionOnServer,
} from '../modules/actions/transactions';
import { getAllUserProjects } from '../modules/selectors/mainProjects';
import { endLoading } from '../modules/actions/loading';
import { InteractiveDatePicker } from '../components/InteractiveDatePicker/InterfactiveDatePicker';

import '../index.scss';
import './TransactionPage.scss';

interface IProps {}

const TransactionPage: React.FC<IProps> = () => {
  const currentTransaction = useSelector(getCurrentTransaction);
  const types = ['income', 'expenses', 'transfer'];
  const [selectedTypeValue, setSelectedTypeValue] = useState<string>(
    currentTransaction ? currentTransaction.type : '',
  );
  const [selectedClassifierValue, setSelectedClassifierValue] =
    useState<string>(currentTransaction ? currentTransaction.classifier : '');
  const { pid, subprojectId, transactionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projects = useSelector(getAllUserProjects);
  const currentProject = projects.find(
    (project) => project._id === currentTransaction.projectId,
  );
  const tabsId = 'main-tabs';
  const style = {
    marginTop: '10px',
  };
  const { inputHandler } = useForm(
    {
      sum: {
        value: '',
        isValid: true,
      },
      projectName: {
        value: '',
        isValid: true,
      },
    },
    true,
  );

  useEffect(() => {
    if (!transactionId) return;

    dispatch(fetchTransactionById(transactionId) as any);
    dispatch(endLoading());
  }, []);

  useEffect(() => {
    if (
      !currentTransaction ||
      (currentTransaction && !currentTransaction.id) ||
      !currentProject ||
      (currentProject && !currentProject._id)
    )
      return;

    if (
      (pid && !subprojectId && currentProject._id !== pid) ||
      (subprojectId && currentProject._id !== subprojectId)
    ) {
      navigate('/');
    }

    if (pid && transactionId && transactionId !== currentTransaction.id) {
      if (subprojectId) {
        navigate(`/project-edit/${pid}/${subprojectId}`);
        return;
      }

      navigate(`/project-edit/${pid}`);
    }
  }, [pid, currentTransaction, currentProject, transactionId, subprojectId]);

  const handleCloseTransactionPage = () => {
    if (pid && !subprojectId) {
      dispatch(setTabValue({ [tabsId]: 'Фінанси' }));
      navigate(`/project-edit/${pid}`);
    } else if (pid && subprojectId) {
      dispatch(setTabValue({ [tabsId]: 'Фінанси' }));
      navigate(`/project-edit/${pid}/${subprojectId}`);
    } else {
      navigate(`/transactions`);
    }
  };

  const handleUpdateTransactionDate = (date: Date) => {
    const timestamp = date.toISOString();

    dispatch(
      updateTransactionOnServer(
        {
          timestamp,
        },
        currentTransaction.id,
        currentTransaction.projectId,
      ) as any,
    );
  };

  return (
    <>
      <SnackbarUI />
      <div className='container'>
        <Header>
          <Button
            size='small'
            transparent={true}
            icon={true}
            customClassName='header__btn-close'
            onClick={handleCloseTransactionPage}
          >
            <img src='/back.svg' alt='back_logo' className='button__icon' />
          </Button>
        </Header>
        <Card>
          <h3 className='transaction__title'>Проект</h3>
          <p>{currentProject && currentProject?.projectName}</p>
          <h3>Дата</h3>
          <InteractiveDatePicker
            timestamp={currentTransaction.timestamp}
            handleChange={handleUpdateTransactionDate}
          />
          <TransactionSelect
            label={'Тип транзакції'}
            keyValue={'type'}
            selectedValue={selectedTypeValue}
            setSelectedValue={setSelectedTypeValue}
            values={types}
            getTranslation={getTransactionLabel}
          />
          <div
            style={{
              position: 'relative',
            }}
          >
            <TransactionSelect
              label={'Класифікатор'}
              keyValue={'classifier'}
              selectedValue={selectedClassifierValue}
              setSelectedValue={setSelectedClassifierValue}
              values={currentTransaction.classifiers[currentTransaction.type]}
            />
            <AddClassifierInputComponent />
          </div>
          <InteractiveInput
            label='Сума'
            id='sum'
            type='number'
            inputHandler={inputHandler}
            entity={currentTransaction}
          />
          <div style={style}>
            <InteractiveInput
              label='Опис'
              id='description'
              inputHandler={inputHandler}
              entity={currentTransaction}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default TransactionPage;
