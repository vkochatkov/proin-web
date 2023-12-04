import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useFiles } from '../hooks/useFiles';
import { FilesContextProvider } from './FilesContextProvider';
import { DynamicInput } from './FormComponent/DynamicInput';
import { IComment, IFile } from '../modules/types/mainProjects';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { getAuth } from '../modules/selectors/user';

interface Props {
  currentObj: any;
  selectedParentId: string;
  defaultInputValue: string;
  isInputActive: boolean;
  setSelectedParentId: Dispatch<SetStateAction<string>>;
  createComment: (comment: IComment) => void;
  setDefaultInputValue: Dispatch<SetStateAction<string>>;
  setIsInputActive: Dispatch<SetStateAction<boolean>>;
}

export const CommentInputWithFiles: React.FC<Props> = ({
  currentObj,
  selectedParentId,
  defaultInputValue,
  isInputActive,
  setSelectedParentId,
  createComment,
  setDefaultInputValue,
  setIsInputActive,
}) => {
  const imageUploadModal = 'imageUploadModal';
  const { files, setFiles, generateDataUrl } = useFiles(imageUploadModal);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const auth = useSelector(getAuth);
  const [inputValue, setInputValue] = useState<string>('');

  const handleCloseInput = () => {
    if (inputRef.current) {
      inputRef.current.blur(); // This will unfocus the input element.
    }

    setIsInputActive(false);
    setDefaultInputValue('');
    setSelectedParentId('');
  };

  const handleCreatingComment = async (value: string) => {
    if (!currentObj) return;

    const id = uuidv4();

    const mentionRegex = /@[a-zA-Zа-яА-Я0-9_]+/;
    const mentions = value.match(mentionRegex);
    const taggedUsers =
      mentions && mentions.input ? mentions.input.split(' ') : [];

    const sendTo = taggedUsers.map((name) => name.replace('@', ''));

    let fileDataArray;

    if (files.length > 0) {
      fileDataArray = await generateDataUrl(files);
    }

    const comment: IComment = {
      id,
      text: value,
      name: auth.name,
      timestamp: new Date().toISOString(),
      userId: auth.userId,
      mentions: sendTo,
      files:
        fileDataArray && fileDataArray.length > 0
          ? (fileDataArray as IFile[])
          : [],
    };

    if (selectedParentId) {
      comment.parentId = selectedParentId;
    }

    createComment(comment);

    setIsInputActive(false);

    if (selectedParentId) {
      setSelectedParentId('');
    }
  };

  return (
    <FilesContextProvider
      files={files}
      setFiles={setFiles}
      generateDataUrl={generateDataUrl}
      onSubmit={handleCreatingComment}
      inputValue={inputValue}
      setInputValue={setInputValue}
    >
      <DynamicInput
        buttonLabel={'Зберегти'}
        onClick={(value) => handleCreatingComment(value)}
        isActive={isInputActive}
        text={defaultInputValue}
        placeholder='Напишіть коментар'
        onCancel={handleCloseInput}
        ref={inputRef}
        uploader
      />
    </FilesContextProvider>
  );
};
