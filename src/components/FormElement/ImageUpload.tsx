import React, { useRef, useState, useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './Button';
import { getAuth } from '../../modules/selectors/user';
import { setCurrentProject } from '../../modules/actions/mainProjects';
import { getCurrentProject } from '../../modules/selectors/mainProjects';
import { useHttpClient } from '../../hooks/useHttpClient';
import './ImageUpload.scss';

type ImageUploadProps = {
  id: string;
  center?: boolean;
  projectId?: string;
  onInput: (id: string, value: string, isValid: boolean) => void;
  isUpdateValue?: boolean;
};

export const ImageUpload: FC<ImageUploadProps> = ({
  id,
  center,
  onInput,
  projectId,
  isUpdateValue,
}) => {
  const [file, setFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const { token } = useSelector(getAuth);
  const dispatch = useDispatch();
  const currentProject = useSelector(getCurrentProject);
  const { sendRequest } = useHttpClient();

  const filePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUpdateValue && currentProject) {
      const isNotEmptyValue = Boolean(currentProject[id]);

      if (isNotEmptyValue) {
        const logoUrl = `${currentProject[id]}`;
        setPreviewUrl(logoUrl);
        onInput(id, logoUrl, true);
      }
    }
  }, [currentProject, isUpdateValue, onInput, id]);

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

  const request = async (id: string, token: string, file: File) => {
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onload = async function () {
        const dataUrl = fileReader.result;

        try {
          const res = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/projects/${id}`,
            'PATCH',
            JSON.stringify({
              logoUrl: dataUrl,
            }),
            {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
            }
          );

          resolve(res);
        } catch (err) {
          reject(err);
        }
      };

      fileReader.readAsDataURL(file);
    });
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
      const res: any = await request(projectId, token, pickedFile);

      value = res.project.logoUrl;

      dispatch(setCurrentProject(res.project));
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
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Додати лого
        </Button>
      </div>
    </div>
  );
};
