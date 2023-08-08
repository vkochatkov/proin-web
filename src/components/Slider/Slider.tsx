import React from 'react';
import Slider from 'react-slick';
import { TransactionItemList } from '../TransactionItemList/TransactionItemList';
import { ITransaction } from '../../modules/types/transactions';
import { Card } from '../UIElements/Card';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Button } from '../FormElement/Button';

import './Slider.scss';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface IProps {
  transactions: ITransaction[];
  changeOrder: (transactions: ITransaction[]) => void;
  generateNavigationString: (id: string) => void;
}

export const TransactionListSlider: React.FC<IProps> = ({
  transactions,
  changeOrder,
  generateNavigationString,
}) => {
  const expensesTransactions = transactions.filter(
    (transaction) => transaction.type === 'expenses',
  );
  const transferTransactions = transactions.filter(
    (transaction) => transaction.type === 'transfer',
  );
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === 'income',
  );
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    useTransform: false,
    draggable: false,
    prevArrow: (
      <Button
        transparent
        icon
        customClassName='slider-transaction-list__left-arrow'
      >
        <KeyboardArrowLeftIcon />
      </Button>
    ),
    nextArrow: (
      <Button
        transparent
        icon
        customClassName='slider-transaction-list__right-arrow'
      >
        <KeyboardArrowRightIcon />
      </Button>
    ),
  };

  return (
    <div>
      <Slider {...settings}>
        <Card className='slider-transaction-list__card'>
          {/* Render 'All' Transactions */}
          <div className='slider-transaction-list__wrapper'>
            <h3>Всі</h3>
            <TransactionItemList
              transactions={transactions}
              generateNavigationString={generateNavigationString}
            />
          </div>
        </Card>
        <Card className='slider-transaction-list__card'>
          {/* Render 'Expenses' Transactions */}
          <div className='slider-transaction-list__wrapper'>
            <h3>Витрати</h3>
            <TransactionItemList
              transactions={expensesTransactions}
              generateNavigationString={generateNavigationString}
            />
          </div>
        </Card>
        <Card className='slider-transaction-list__card'>
          {/* Render 'Income' Transactions */}
          <div className='slider-transaction-list__wrapper'>
            <h3>Доходи</h3>
            <TransactionItemList
              transactions={incomeTransactions}
              generateNavigationString={generateNavigationString}
            />
          </div>
        </Card>
        <Card className='slider-transaction-list__card'>
          {/* Render 'Income' Transactions */}
          <div className='slider-transaction-list__wrapper'>
            <h3>Перекази</h3>
            <TransactionItemList
              transactions={transferTransactions}
              generateNavigationString={generateNavigationString}
            />
          </div>
        </Card>
      </Slider>
    </div>
  );
};
