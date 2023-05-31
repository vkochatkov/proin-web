import { ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useFiles } from '../../../hooks/useFiles';
import { updateCurrentTask } from '../../../modules/actions/currentTask';
import { FileUploader } from '../../FormElement/FileUploader';

interface IProps {
  id: string;
}

export const TaskFilesUpload = ({ id }: IProps) => {
  const { files, setFiles, generateDataUrl } = useFiles();
  const dispatch = useDispatch();
  const { pid, taskId } = useParams();

  const sendFilesToServer = async (files: File[]) => {
    try {
      const fileDataArray = await generateDataUrl(files);

      if (!pid || !taskId) return;

      dispatch(updateCurrentTask({ files: fileDataArray }, pid, taskId) as any);
    } catch (err) {
      console.log(err);
    }
  };

  const pickedHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const pickedFiles = event.target.files;

    if (!pickedFiles?.length) {
      return;
    }

    const newFiles = Array.from(pickedFiles);

    setFiles([...files, ...newFiles]);

    try {
      const res = await sendFilesToServer(newFiles);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <FileUploader
      id={id}
      pickedHandler={pickedHandler}
      buttonLabel={'Завантажити файли'}
      multiple
      className="file-uploader__btn"
    />
  );
};
