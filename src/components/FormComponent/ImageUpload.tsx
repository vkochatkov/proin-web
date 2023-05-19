import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import { useHttpClient } from '../../hooks/useHttpClient';
import { setCurrentProject } from '../../modules/actions/mainProjects';
import { getCurrentProject } from '../../modules/selectors/mainProjects';
import { getAuth } from '../../modules/selectors/user';
import { FileUploader } from '../FormElement/FileUploader';
import { ProjectDescription } from './ProjectInputEditor';

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
  const currentProject = useSelector(getCurrentProject);
  const [file, setFile] = useState<File | undefined>();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>('');
  const { token } = useSelector(getAuth);
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

  return (
    <>
      <div className={`file-uploader ${center ? 'center' : ''}`}>
        {previewUrl && (
          <div className="file-uploader__preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}
        <div
          style={{
            marginLeft: '1rem',
          }}
        >
          <ProjectDescription
            id="projectName"
            inputHandler={inputHandler}
            token={token}
            project={currentProject}
          />
        </div>
      </div>
      <FileUploader
        id={id}
        pickedHandler={pickedHandler}
        allowedTypes=".jpg,.png,.jpeg"
        buttonLabel={'Додати лого'}
        className="logo"
      />
    </>
  );
};
