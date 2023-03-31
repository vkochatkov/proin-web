import { useEffect, useState, useRef, useCallback } from 'react';
import { validate } from '../../utils/validators';
import { debounce } from '../../utils/debounce';
import axios from 'axios';
import { editProjectSuccess } from '../../modules/actions/mainProjects';
import { useDispatch, useSelector } from 'react-redux';
import { getIsLoading } from '../../modules/selectors/loading';
import { endLoading } from '../../modules/actions/loading';
import './Input.scss';

type InputProps = {
  id: string;
  element?: 'input' | 'textarea';
  type?: string;
  label: string;
  placeholder?: string;
  initialValue?: string;
  initialValid?: boolean;
  isAutosave?: boolean;
  validators?: { type: string }[];
  onInput: (id: string, value: string, isValid: boolean) => void;
  rows?: number;
  errorText?: string;
  isAnyValue?: boolean;
  projectId?: string;
  token?: string;
  isUpdateValue?: boolean;
  project?: any;
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

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputState.value, textareaRef.current]);

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

  const saveChanges = useCallback(
    debounce((data: any, token: string, projectId: string) => {
      const request = axios.CancelToken.source();

      axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_BACKEND_URL}/projects/${projectId}`,
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        cancelToken: request.token,
      })
        .then(({ data }) => {
          dispatch(editProjectSuccess(data.project));
        })
        .catch(() => {});
    }, 1000),
    []
  );

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;

    setInputState((prevState) => ({
      ...prevState,
      value: newValue,
      isValid: props.isAnyValue
        ? props.isAnyValue
        : validate(newValue, props.validators),
    }));
    if (props.isAutosave && props.token) {
      saveChanges({ [id]: newValue }, props.token, props.projectId);
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
        ref={textareaRef}
        // style={{ minHeight: '100px' }}

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
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {/* {!props.isAnyValue && !inputState.isValid && inputState.isTouched && (
        <p>{props.errorText}</p>
      )} */}
    </div>
  );
};
