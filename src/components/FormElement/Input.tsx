import { useEffect, useState } from 'react';
import { validate } from '../../utils/validators';
import './Input.scss';

type InputProps = {
  id: string;
  element?: 'input' | 'textarea';
  type?: string;
  label: string;
  placeholder?: string;
  initialValue?: string;
  initialValid?: boolean;
  validators?: { type: string }[];
  onInput: (id: string, value: string, isValid: boolean) => void;
  rows?: number;
  errorText?: string;
};

export const Input = (props: InputProps) => {
  const [inputState, setInputState] = useState({
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputState((prevState) => ({
      ...prevState,
      value: event.target.value,
      isValid: validate(event.target.value, props.validators),
    }));
  };

  const touchHandler = () => {
    setInputState((prevState) => ({
      ...prevState,
      isTouched: true,
    }));
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};
