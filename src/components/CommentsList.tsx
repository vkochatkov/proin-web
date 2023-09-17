import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommentBox } from './CommentBox';
import { DynamicInput } from './FormComponent/DynamicInput';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from '../modules/selectors/user';
import { IComment } from '../modules/reducers/mainProjects';
import { openModal } from '../modules/actions/modal';
import { setIdForDelete } from '../modules/actions/idForRemove';

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
  const [isInputActive, setIsInputActive] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const dispatch = useDispatch();

  const handleCreatingComment = (value: string) => {
    if (!currentObj) return;

    const id = uuidv4();

    const mentionRegex = /@[a-zA-Zа-яА-Я0-9_]+/;
    const mentions = value.match(mentionRegex);
    const taggedUsers =
      mentions && mentions.input ? mentions.input.split(' ') : [];

    const sendTo = taggedUsers.map((name) => name.replace('@', ''));

    const comment: IComment = {
      id,
      text: value,
      name: auth.name,
      timestamp: new Date().toISOString(),
      userId: auth.userId,
      mentions: sendTo,
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

  return (
    <>
      <DynamicInput
        onClick={handleCreatingComment}
        isActive={isInputActive}
        text={defaultInputValue}
        buttonLabel={'Зберегти'}
        placeholder='Напишіть коментар'
        onCancel={() => {
          setIsInputActive(false);
          setDefaultInputValue('');
        }}
      />
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
                <DynamicInput
                  placeholder='Напишіть коментар'
                  onClick={(value) => handleUpdateComment(comment.id, value)}
                  onCancel={() => setSelectedCommentIds(updatedSelectedIds)}
                  isActive={true}
                  text={comment.text}
                  buttonLabel={'Зберегти'}
                />
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
};
