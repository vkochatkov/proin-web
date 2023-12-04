import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { FilesContextProvider } from './FilesContextProvider';
import { useFiles } from '../hooks/useFiles';
import { DynamicInput } from './FormComponent/DynamicInput';
import { IComment } from '../modules/types/mainProjects';
import { CommentBox } from './CommentBox';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { openModal } from '../modules/actions/modal';
import { setIdForDelete } from '../modules/actions/idForRemove';

interface IProps {
  currentObj: any;
  modalId: string;
  updateComment: (
    updatedComment: IComment,
    updatedComments: IComment[],
  ) => void;
  setSelectedParentId: Dispatch<SetStateAction<string>>;
  setDefaultInputValue: Dispatch<SetStateAction<string>>;
  comment: IComment;
  setIsInputActive: Dispatch<SetStateAction<boolean>>;
}

export const EdittedComment: React.FC<IProps> = ({
  currentObj,
  updateComment,
  setSelectedParentId,
  modalId,
  setDefaultInputValue,
  setIsInputActive,
  comment,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const imageUploadModal = 'imageUploadModal';
  const { files, setFiles, generateDataUrl } = useFiles(imageUploadModal);
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>(['']);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  const renderComment = () => {
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
          key={comment.id}
        >
          {comment.files.map((image) => (
            <img
              key={uuidv4()}
              src={image.url}
              alt={image.name}
              className='comments-list__comment-image'
            />
          ))}
          <FilesContextProvider
            files={files}
            setFiles={setFiles}
            generateDataUrl={generateDataUrl}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSubmit={() => {}}
          >
            <DynamicInput
              placeholder='Напишіть коментар'
              onClick={(value) => handleUpdateComment(comment.id, value)}
              onCancel={() => setSelectedCommentIds(updatedSelectedIds)}
              isActive
              text={comment.text}
              buttonLabel={'Зберегти'}
              isImageUploadDisable
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
          key={`${comment.id}-${uuidv4()}`}
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
  };

  return <>{renderComment()}</>;
};
