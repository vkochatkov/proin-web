import React, { useRef, useState, useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Button } from './Button';
import { getAuth } from '../../modules/selectors/user';
import { editProjectSuccess } from '../../modules/actions/mainProjects';
import { getCurrentProject } from '../../modules/selectors/mainProjects';
import { endLoading } from '../../modules/actions/loading';
import './ImageUpload.scss';

type ImageUploadProps = {
  id: string;
  center?: boolean;
  projectId?: string;
  onInput: (id: string, value: string, isValid: boolean) => void;
  stateToUpdate?: boolean;
};

export const ImageUpload: FC<ImageUploadProps> = ({
  id,
  center,
  onInput,
  projectId,
  stateToUpdate,
}) => {
  const [file, setFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const { token } = useSelector(getAuth);
  const dispatch = useDispatch();
  const currentProject = useSelector(getCurrentProject);

  const filePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stateToUpdate && currentProject) {
      const isNotEmptyValue = Boolean(currentProject[id]);

      if (isNotEmptyValue) {
        const logoUrl = `${currentProject[id]}`;
        setPreviewUrl(logoUrl);
        onInput(id, logoUrl, true);
        dispatch(endLoading());
      }
    }
  }, [currentProject, stateToUpdate, onInput, dispatch, id]);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const sendRequest = async (id: string, token: string, file: File) => {
    const httpSource = axios.CancelToken.source();

    const formData = new FormData();

    formData.append('image', file);

    try {
      const response = await axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_BACKEND_URL}/projects/${id}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        cancelToken: httpSource.token,
      });

      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const pickedHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    let value;

    if (projectId && pickedFile) {
      const res = await sendRequest(projectId, token, pickedFile);
      value = res.project.logoUrl;

      dispatch(editProjectSuccess(res.project));
    }

    onInput(id, value, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current?.click();
  };

  return (
    <div className="form-control">
      <input
        id={id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${center ? 'center' : ''}`}>
        {previewUrl && (
          <div className="image-upload__preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}
        <Button type="button" onClick={pickImageHandler}>
          Обери лого
        </Button>
      </div>
    </div>
  );
};