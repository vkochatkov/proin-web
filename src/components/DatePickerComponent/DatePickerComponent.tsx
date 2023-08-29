import { Dispatch, SetStateAction, useState } from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker'; // Import registerLocale

import uk from 'date-fns/locale/uk'; // Import the Ukrainian locale

import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerComponent.scss';

interface IProps {
  initialValue: string;
  onChnage: (date: Date) => void;
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
}

registerLocale('uk', uk);

export const DatePickerComponent: React.FC<IProps> = ({
  initialValue,
  onChnage,
  isActive,
  setIsActive,
}) => {
  const [startDate, setStartDate] = useState(new Date(initialValue));

  const handleChange = (date: Date) => {
    setStartDate(date);
    onChnage(date);
    setIsActive(false);
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={handleChange}
      dateFormat='dd.MM.yyyy'
      open={isActive}
      locale={uk}
    />
  );
};
