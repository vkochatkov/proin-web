import { useState } from 'react';
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

import '../index.scss';
import './TransactionPage.scss';

interface IProps {}

const TransactionPage: React.FC<IProps> = () => { 
  const currentTransaction = useSelector(getCurrentTransaction);
  const types = ['income', 'expenses', 'transfer'];
  const [selectedTypeValue, setSelectedTypeValue] = useState<string>(
    currentTransaction ? currentTransaction.type : ''
  );
  const [selectedClassifierValue, setSelectedClassifierValue] = useState<string>(
    currentTransaction ? currentTransaction.classifier : ''
  );
  const { pid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    },
    true
  );

  const handleCloseTransactionPage = () => {
    if (pid) {
      dispatch(setTabValue({ [tabsId]: 'Фінанси' }));
      navigate(`/project-edit/${pid}`);
    } else {
      navigate(`/transactions`);
    }
  };

  return (
    <>
    <SnackbarUI />
    <div className="container">
      <Header>
        <Button
          size="small"
          transparent={true}
          icon={true}
          customClassName="header__btn-close"
          onClick={handleCloseTransactionPage}
        >
          <img src="/back.svg" alt="back_logo" className="button__icon" />
        </Button>
      </Header>
      <Card>
        <TransactionSelect
          label={"Тип транзакції"}
          keyValue={'type'}
          selectedValue={selectedTypeValue}
          setSelectedValue={setSelectedTypeValue}
          values={types}
          getTranslation={getTransactionLabel}
        />
         <TransactionSelect
          label={"Класифікатор"}
          keyValue={'classifier'}
          selectedValue={selectedClassifierValue}
          setSelectedValue={setSelectedClassifierValue}
          values={currentTransaction.classifiers}
        />
       <AddClassifierInputComponent inputHandler={inputHandler} />
        <InteractiveInput
          label='Сума'
          id="sum"
          inputHandler={inputHandler}
          entity={currentTransaction}
        />
        <div style={style}>
          <InteractiveInput
            id="description"
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
