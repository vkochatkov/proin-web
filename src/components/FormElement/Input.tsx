import { useEffect, useState, useRef } from 'react';
import { validate } from '../../utils/validators';
import { useDispatch, useSelector } from 'react-redux';
import { getIsLoading } from '../../modules/selectors/loading';
import { endLoading } from '../../modules/actions/loading';

import './Input.scss';

type InputProps = {
  id: string;
  element?: 'input' | 'textarea';
  type?: string;
  label?: string;
  placeholder?: string;
  initialValue?: string;
  initialValid?: boolean;
  validators?: { type: string }[];
  onInput: (id: string, value: string, isValid: boolean) => void;
  rows?: number;
  errorText?: string;
  isAnyValue?: boolean;
  projectId?: string;
  isUpdateValue?: boolean;
  project?: any;
  labelClassName?: string;
  isActive?: boolean;
  className?: string;
  changeHandler?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export const Input = (props: InputProps) => {
  const [inputState, setInputState] = useState({
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });
  const dispatch = useDispatch();
  const { id, onInput } = props;
  const { value, isValid } = inputState;
  const isLoading = useSelector(getIsLoading);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.isActive) {
      textareaRef.current?.focus();
      inputRef.current?.focus();
    }
  }, [props.isActive]);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  useEffect(() => {
    if (
      props.isUpdateValue &&
      props.project !== null &&
      props.project !== undefined
    ) {
      const inputValue = props.project[id];

      if (inputValue) {
        setInputState((prevState) => ({
          ...prevState,
          value: props.project[id],
        }));
      }
    }
  }, [props.project, props.isUpdateValue, id]);

  useEffect(() => {
    if (isLoading && props.isUpdateValue) {
      dispatch(endLoading());
    }
  }, [dispatch, props.isUpdateValue, inputState, isLoading]);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;

    setInputState((prevState) => ({
      ...prevState,
      value: newValue,
      isValid: props.isAnyValue
        ? props.isAnyValue
        : validate(newValue, props.validators),
    }));

    if (props.changeHandler) {
      props.changeHandler(e);
    }
  };

  const touchHandler = () => {
    setInputState((prevState) => ({
      ...prevState,
      isTouched: true,
    }));
  };

  // const openFullscreen = () => {
  //   const element = elementRef.current;
  //   //@ts-ignore because of openFullscreen
  //   if (element && element.requestFullscreen) {
  //     //@ts-ignore
  //     element.requestFullscreen();
  //   }
  // };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={handleChangeInput}
        onBlur={touchHandler}
        value={inputState.value}
        ref={inputRef}
        className={props.className ? props.className : ''}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={handleChangeInput}
        onBlur={touchHandler}
        value={inputState.value}
        ref={textareaRef}
        autoComplete="off"
        className={props.className ? props.className : ''}
        // onClick={openFullscreen}
        // onKeyDown={(event) => {
        //   if (event.key === 'Escape') {
        //     document.exitFullscreen();
        //   }
        // }}
      />
    );

  return (
    <div
      className={
        'form-control'
        // !props.isAnyValue &&
        // !inputState.isValid &&
        // inputState.isTouched &&
        // 'form-control--invalid'
      }
    >
      {props.label && (
        <label
          htmlFor={props.id}
          className={props.labelClassName ? `${props.labelClassName}` : ''}
        >
          {props.label}
        </label>
      )}
      {element}
      {/* {!props.isAnyValue && !inputState.isValid && inputState.isTouched && (
        <p>{props.errorText}</p>
      )} */}
    </div>
  );
};
