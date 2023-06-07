import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import { useHttpClient } from '../../hooks/useHttpClient';
import { setCurrentProject } from '../../modules/actions/mainProjects';
import {
  getCurrentProject,
  getCurrentProjects,
} from '../../modules/selectors/mainProjects';
import { getAuth } from '../../modules/selectors/user';
import { Button } from '../FormElement/Button';
import { InteractiveInput } from './InteractiveInput';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import {
  endFilesLoading,
  startFilesLoading,
} from '../../modules/actions/loading';
import { getIsFilesLoading } from '../../modules/selectors/loading';
import CircularProgress from '@mui/material/CircularProgress';

interface IImageUpload {
  inputHandler: (id: string, value: string, isValid: boolean) => void;
  isUpdateValue: boolean;
  onInput: (id: string, value: string, isValid: boolean) => void;
  projectId?: string;
  center?: boolean;
  id: string;
}

export const ImageUpload = ({
  isUpdateValue,
  onInput,
  id,
  projectId,
  center,
}: IImageUpload) => {
  const projects = useSelector(getCurrentProjects);
  const currentProject = useSelector(getCurrentProject);
  const [file, setFile] = useState<File | undefined>();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>('');
  const { token } = useSelector(getAuth);
  const isLoading = useSelector(getIsFilesLoading);
  const dispatch = useDispatch();
  const { sendRequest } = useHttpClient();
  const { inputHandler } = useForm(
    {
      projectName: {
        value: '',
        isValid: true,
      },
    },
    true
  );
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
      dispatch(startFilesLoading());
      const res: any = await request(projectId, token, pickedFile);

      dispatch(endFilesLoading());

      value = res.project.logoUrl;

      dispatch(setCurrentProject(res.project));
    }

    onInput(id, value, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current?.click();
  };

  return (
    <>
      <div className={`file-uploader ${center ? 'center' : ''}`}>
        <Button icon transparent type="button" onClick={pickImageHandler}>
          {previewUrl && !isLoading ? (
            <div className="file-uploader__preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          ) : (
            <div className="file-uploader__preview">
              {isLoading ? (
                <CircularProgress />
              ) : (
                <DriveFolderUploadIcon fontSize="large" />
              )}
            </div>
          )}
        </Button>
        <div
          style={{
            marginLeft: '1rem',
          }}
        >
          <InteractiveInput
            id="projectName"
            inputHandler={inputHandler}
            token={token}
            entity={currentProject}
            entities={projects}
          />
          <input
            id={id}
            ref={filePickerRef}
            style={{ display: 'none' }}
            type="file"
            accept={'.jpg,.png,.jpeg'}
            onChange={pickedHandler}
            multiple={false}
          />
        </div>
      </div>
    </>
  );
};
