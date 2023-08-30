import { useEffect, useRef, useState } from 'react';
import { DatePickerComponent } from '../DatePickerComponent/DatePickerComponent';
import { ProjectTextOutput } from '../FormComponent/ProjectTextOutput';

import './InteractiveDatePicker.scss';

interface IProps {
  timestamp: string;
  handleChange: (date: Date) => void;
}

export const InteractiveDatePicker: React.FC<IProps> = ({
  timestamp,
  handleChange,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
  const datePickerRef = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target as Node)
    ) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={datePickerRef} className='interactive-datepicker'>
      {isActive && (
        <DatePickerComponent
          initialValue={timestamp}
          onChnage={handleChange}
          isActive={isActive}
          setIsActive={setIsActive}
        />
      )}
      {!isActive && (
        <div onClick={() => setIsActive(true)}>
          <ProjectTextOutput text={formattedDate} fieldId={'timestamp'} />
        </div>
      )}
    </div>
  );
};
