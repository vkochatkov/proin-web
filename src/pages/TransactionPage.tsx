import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InteractiveInput } from '../components/FormComponent/InteractiveInput';
import { Card } from '../components/UIElements/Card';
import { useForm } from '../hooks/useForm';
import { Button } from '../components/FormElement/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { setTabValue } from '../modules/actions/tabs';
import { getCurrentTransaction } from '../modules/selectors/currentTransaction';
import { TransactionSelect } from '../components/FormComponent/TransactionSelect';
import { SnackbarUI } from '../components/UIElements/SnackbarUI';
import { getTransactionLabel } from '../utils/utils';
import { AddClassifierInputComponent } from '../components/FormComponent/AddClassifierInputComponent';
import {
  changeTransactionFilesOrder,
  fetchTransactionById,
  removeFileFromTransaction,
  updateTransactionOnServer,
  uploadFilesToTheServer,
} from '../modules/actions/transactions';
import { getAllUserProjects } from '../modules/selectors/mainProjects';
import { endLoading } from '../modules/actions/loading';
import { InteractiveDatePicker } from '../components/InteractiveDatePicker/InterfactiveDatePicker';
import { useFiles } from '../hooks/useFiles';
import { FileUploadComponent } from '../components/FormComponent/FileUploadComponent/FileUploadComponent';
import { FilesList } from '../components/FilesList/FilesList';
import { closeModal } from '../modules/actions/modal';
import { RemoveModal } from '../components/Modals/RemoveModal';
import { IFile } from '../modules/types/mainProjects';
import { PROJECTS_PATH } from '../config/routes';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { TransactionCommentsComponent } from '../components/TransactionCommentsComponent';

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
  const modalId = 'remove-file';
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
  const {
    files,
    setFiles,
    generateDataUrl,
    handleOpenRemoveFileModal,
    selectedFileId,
  } = useFiles(modalId);

  useEffect(() => {
    if (!transactionId) return;

    dispatch(fetchTransactionById(transactionId) as any);
    dispatch(endLoading());

    // eslint-disable-next-line
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
      navigate(PROJECTS_PATH);
    }

    if (pid && transactionId && transactionId !== currentTransaction.id) {
      if (subprojectId) {
        navigate(`${PROJECTS_PATH}/${pid}/${subprojectId}`);
        return;
      }

      navigate(`${PROJECTS_PATH}/${pid}`);
    }
  }, [
    pid,
    currentTransaction,
    currentProject,
    transactionId,
    subprojectId,
    navigate,
  ]);

  const handleCloseTransactionPage = () => {
    if (pid && !subprojectId) {
      dispatch(setTabValue({ [tabsId]: 'Фінанси' }));
      navigate(`${PROJECTS_PATH}/${pid}`);
    } else if (pid && subprojectId) {
      dispatch(setTabValue({ [tabsId]: 'Фінанси' }));
      navigate(`${PROJECTS_PATH}/${pid}/${subprojectId}`);
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

  const sendFilesToServer = async (files: File[]) => {
    try {
      const fileDataArray = await generateDataUrl(files);
      if (!currentTransaction || !transactionId) return;

      dispatch(
        uploadFilesToTheServer(
          { files: fileDataArray },
          transactionId,
          currentTransaction.projectId,
        ) as any,
      );
    } catch (err) {
      console.log(err);
    }
  };

  const saveFilesOrder = (order: IFile[]) => {
    dispatch(
      changeTransactionFilesOrder({
        files: order,
        transactionId: currentTransaction.id,
      }) as any,
    );
  };

  const handleDeleteFile = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    dispatch(
      removeFileFromTransaction(currentTransaction.id, selectedFileId) as any,
    );
    dispatch(closeModal({ id: modalId }));
  };

  return (
    <>
      <RemoveModal
        submitHandler={handleDeleteFile}
        modalId={modalId}
        text='файл'
      />
      <SnackbarUI />
      <div className='container'>
        <Card>
          <Button
            size='small'
            transparent
            icon
            customClassName='back__btn'
            onClick={handleCloseTransactionPage}
          >
            <ArrowBackIosIcon />
            <p>Назад</p>
          </Button>
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
          <div className='transaction__files-wrapper'>
            <FilesList
              files={currentTransaction.files}
              saveFilesOrder={saveFilesOrder}
              handleOpenModal={handleOpenRemoveFileModal}
            />
          </div>
          <div className='transaction__files-wrapper'>
            <FileUploadComponent
              id={'files'}
              files={files}
              setFiles={setFiles}
              sendFilesToServer={sendFilesToServer}
            />
          </div>
          <h3>Коментарі</h3>
          <TransactionCommentsComponent currentObj={currentTransaction} />
        </Card>
      </div>
    </>
  );
};

export default TransactionPage;
