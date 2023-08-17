import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Slider from 'react-slick';
import { TransactionItemList } from '../TransactionItemList/TransactionItemList';
import { ITransaction } from '../../modules/types/transactions';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Button } from '../FormElement/Button';
import { getCurrentTabIndex } from '../../modules/selectors/activeTabIndex';
import { setActiveTabIndex } from '../../modules/actions/activeTabIndex';

import './TransactionListSlider.scss';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface IProps {
  transactions: ITransaction[];
  generateNavigationString: (id: string) => void;
}

export const TransactionListSlider: React.FC<IProps> = ({
  transactions,
  generateNavigationString,
}) => {
  const activeIndex = useSelector(getCurrentTabIndex);
  const dispatch = useDispatch();
  const sliderRef = useRef<Slider | null>(null);
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

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(activeIndex);
    }
  }, [activeIndex]);

  const handleSliderAfterChange = (index: number) => {
    if (index !== activeIndex) {
      dispatch(setActiveTabIndex(index));
    }
  };

  const isTransactionsExist = (transactions: ITransaction[]) => {
    if (!transactions) return;

    return transactions && transactions.length > 0;
  };

  return (
    <div>
      <Slider
        ref={sliderRef}
        {...settings}
        afterChange={handleSliderAfterChange}
      >
        {/* Render 'All' Transactions */}
        <div className='slider-transaction-list__wrapper'>
          {isTransactionsExist(transactions) ? (
            <TransactionItemList
              transactions={transactions}
              generateNavigationString={generateNavigationString}
            />
          ) : (
            <h2>Транзакцій немає</h2>
          )}
        </div>
        {/* Render 'Expenses' Transactions */}
        <div className='slider-transaction-list__wrapper'>
          {isTransactionsExist(expensesTransactions) ? (
            <TransactionItemList
              transactions={expensesTransactions}
              generateNavigationString={generateNavigationString}
            />
          ) : (
            <h2>Витрат немає</h2>
          )}
        </div>
        {/* Render 'Income' Transactions */}
        <div className='slider-transaction-list__wrapper'>
          {/* <h3>Доходи</h3> */}
          {isTransactionsExist(incomeTransactions) ? (
            <TransactionItemList
              transactions={incomeTransactions}
              generateNavigationString={generateNavigationString}
            />
          ) : (
            <h2>Доходів немає</h2>
          )}
        </div>
        {/* Render 'Income' Transactions */}
        <div className='slider-transaction-list__wrapper'>
          {isTransactionsExist(transferTransactions) ? (
            <TransactionItemList
              transactions={transferTransactions}
              generateNavigationString={generateNavigationString}
            />
          ) : (
            <h2>Переказів немає</h2>
          )}
        </div>
      </Slider>
    </div>
  );
};
