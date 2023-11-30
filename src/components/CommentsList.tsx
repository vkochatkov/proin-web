import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommentBox } from './CommentBox';
import { DynamicInput } from './FormComponent/DynamicInput';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from '../modules/selectors/user';
import { openModal } from '../modules/actions/modal';
import { setIdForDelete } from '../modules/actions/idForRemove';
import { IComment, IFile } from '../modules/types/mainProjects';
import { FilePickerRefProvider } from './ContextProvider/FilesPickerRefProvider';
import { useFiles } from '../hooks/useFiles';
import { FilesContextProvider } from './FilesContextProvider';
import { getIsCommentLoading } from '../modules/selectors/loading';
import { CommentSceleton } from './CommentSceleton';

interface IProps {
  currentObj: any;
  modalId: string;
  updateComment: (
    updatedComment: IComment,
    updatedComments: IComment[],
  ) => void;
  createComment: (comment: IComment) => void;
}

export const CommentsList: React.FC<IProps> = ({
  currentObj,
  modalId,
  updateComment,
  createComment,
}) => {
  const auth = useSelector(getAuth);
  const [selectedCommentIds, setSelectedCommentIds] = React.useState<string[]>([
    '',
  ]);
  const [defaultInputValue, setDefaultInputValue] = useState('');
  const [isInputActive, setIsInputActive] = useState<boolean>(false);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();
  const imageUploadModal = 'imageUploadModal';
  const { files, setFiles, generateDataUrl } = useFiles(imageUploadModal);
  const isCommentLoading = useSelector(getIsCommentLoading);
  const filesContextProps = {
    files,
    setFiles,
    generateDataUrl,
    onSubmit: () => {},
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

  const handleEditComment = (id: string) => {
    setSelectedCommentIds([...selectedCommentIds, id]);
  };

  const handleReplyComment = (parentId: string, name?: string) => {
    setIsInputActive(true);
    setSelectedParentId(parentId);

    // Scroll to the DynamicInput
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (name) {
      const userName = `@${name}`;

      setDefaultInputValue(userName);
    }
  };

  const handleUpdateComment = (id: string, value: string) => {
    if (!currentObj) return;

    const { comments } = currentObj;
    let updatedComment;

    if (!comments) return;

    const updatedComments = comments.map((comment: IComment) => {
      if (comment.id === id) {
        updatedComment = {
          ...comment,
          text: value,
        };

        return updatedComment;
      } else {
        return comment;
      }
    });

    const updatedSelectedIds = selectedCommentIds.filter(
      (commentId) => commentId !== id,
    );

    if (!updatedComment) return;

    updateComment(updatedComment, updatedComments);
    setSelectedCommentIds(updatedSelectedIds);
  };

  const handleOpenRemoveModal = (id: string) => {
    dispatch(
      openModal({
        id: modalId,
      }),
    );
    dispatch(setIdForDelete(id));
  };

  const handleCopyClick = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
  };

  const handleCloseInput = () => {
    if (inputRef.current) {
      inputRef.current.blur(); // This will unfocus the input element.
    }

    setIsInputActive(false);
    setDefaultInputValue('');
    setSelectedParentId('');
  };

  const renderComment = () => (
    <>
      {currentObj &&
        currentObj.comments &&
        currentObj.comments.map((comment: IComment, index: number) => {
          const updatedSelectedIds = selectedCommentIds.filter(
            (commentId) => commentId !== comment.id,
          );

          const selectedCommentId = selectedCommentIds.find(
            (id) => id === comment.id,
          );

          if (!comment.id) return null;

          if (comment.id && comment.id === selectedCommentId) {
            return (
              <div
                style={{
                  marginTop: '1rem',
                }}
                key={`${comment.id}-${Math.random()}`}
              >
                <FilesContextProvider
                  {...filesContextProps}
                  onSubmit={() => console.log('edit submit')}
                >
                  <DynamicInput
                    placeholder='Напишіть коментар'
                    onClick={(value) => handleUpdateComment(comment.id, value)}
                    onCancel={() => setSelectedCommentIds(updatedSelectedIds)}
                    isActive
                    text={comment.text}
                    buttonLabel={'Зберегти'}
                  />
                </FilesContextProvider>
              </div>
            );
          } else {
            const repliedComment = currentObj.comments.find(
              (c: IComment) => c.id === comment.parentId,
            );
            return (
              <CommentBox
                key={`${comment.id}-${index}`}
                text={comment.text}
                name={comment.name}
                files={comment.files}
                timestamp={comment.timestamp}
                id={comment.id}
                userId={comment.userId}
                parentCommentId={comment.parentId}
                replyUserCommentText={
                  repliedComment ? repliedComment.text : undefined
                }
                replyUser={repliedComment ? repliedComment.name : undefined}
                onDelete={handleOpenRemoveModal}
                onEdit={handleEditComment}
                onReply={handleReplyComment}
                onCopy={handleCopyClick}
              />
            );
          }
        })}
    </>
  );

  return (
    <FilePickerRefProvider>
      <FilesContextProvider
        {...filesContextProps}
        onSubmit={handleCreatingComment}
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
      {isCommentLoading && <CommentSceleton />}
      {renderComment()}
    </FilePickerRefProvider>
  );
};
