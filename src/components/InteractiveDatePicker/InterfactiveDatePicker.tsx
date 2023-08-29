import { useState } from 'react';
import { DatePickerComponent } from '../DatePickerComponent/DatePickerComponent';
import { ProjectTextOutput } from '../FormComponent/ProjectTextOutput';

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

  return (
    <div
      onBlur={() => {
        // setIsActive(false);
      }}
    >
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
