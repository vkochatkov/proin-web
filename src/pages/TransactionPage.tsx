import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InteractiveInput } from '../components/FormComponent/InteractiveInput';
import { Card } from '../components/UIElements/Card';
import { useForm } from '../hooks/useForm';
import { getAuth } from '../modules/selectors/user';
import { Header } from '../components/Navigation/Header';
import { Button } from '../components/FormElement/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { setTabValue } from '../modules/actions/tabs';
import { getCurrentTransaction } from '../modules/selectors/currentTransaction';
import { TransactionSelect } from '../components/FormComponent/TransactionSelect';

import '../index.scss';

interface IProps {}

const TransactionPage: React.FC<IProps> = () => {
  const { token } = useSelector(getAuth);
  const currentTransaction = useSelector(getCurrentTransaction);
  const types = ['income', 'expenses', 'transfer'];
  const [selectedValue, setSelectedValue] = useState(
    currentTransaction ? currentTransaction.type : types[0]
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
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          types={types}
        />
        <InteractiveInput
          label={'Сума'}
          id="sum"
          inputHandler={inputHandler}
          token={token}
          entity={currentTransaction}
        />
        <div style={style}>
          <InteractiveInput
            id="description"
            inputHandler={inputHandler}
            token={token}
            entity={currentTransaction}
          />
        </div>
        <div style={style}>
          <InteractiveInput
            label="Класифікатор"
            id="classifier"
            inputHandler={inputHandler}
            token={token}
            entity={currentTransaction}
          />
        </div>
      </Card>
    </div>
  );
};

export default TransactionPage;
