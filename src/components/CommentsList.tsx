import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CommentBox } from './CommentBox';
import { DynamicInput } from './FormComponent/DynamicInput';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from '../modules/selectors/user';
import { IComment } from '../modules/reducers/mainProjects';

interface IProps {
  currentObj: any;
  deleteComment: ({ id, updatedObj }: { id: string; updatedObj: any }) => void;
  updateComment: (
    updatedComment: IComment,
    updatedComments: IComment[]
  ) => void;
  createComment: (comment: IComment) => void;
}

export const CommentsList = ({
  currentObj,
  deleteComment,
  updateComment,
  createComment,
}: IProps) => {
  const auth = useSelector(getAuth);
  const [selectedCommentIds, setSelectedCommentIds] = React.useState<string[]>([
    '',
  ]);
  const [defaultInputValue, setDefaultInputValue] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);

  const handleCreatingComment = (value: string) => {
    if (!currentObj) return;

    const id = uuidv4();

    const mentionRegex = /@[a-zA-Z0-9_]+/;
    const mentions = value.match(mentionRegex);
    const taggedUsers =
      mentions && mentions.input ? mentions.input.split(' ') : [];

    const sendTo = taggedUsers.map((name) => name.replace('@', ''));

    const comment = {
      id,
      text: value,
      name: auth.name,
      timestamp: new Date().toISOString(),
      userId: auth.userId,
      mentions: sendTo,
    };

    createComment(comment);

    setIsInputActive(false);
  };

  const handleDeleteComment = (id: string) => {
    if (!currentObj) return;

    const { comments } = currentObj;

    if (comments) {
      const updatedComments = comments.filter(
        (comment: IComment) => comment.id !== id
      );
      const updatedObj = {
        ...currentObj,
        comments: updatedComments,
      };

      deleteComment({ id, updatedObj });
    }
  };

  const handleEditComment = (id: string) => {
    setSelectedCommentIds([...selectedCommentIds, id]);
  };

  const handleReplyComment = (name: string) => {
    const userName = `@${name}`;

    setIsInputActive(true);
    setDefaultInputValue(userName);
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
      (commentId) => commentId !== id
    );

    if (!updatedComment) return;

    updateComment(updatedComment, updatedComments);
    setSelectedCommentIds(updatedSelectedIds);
  };

  return (
    <>
      <DynamicInput
        onClick={handleCreatingComment}
        isActive={isInputActive}
        text={defaultInputValue}
        buttonLabel={'Зберегти'}
        placeholder="Напишіть коментар"
        onCancel={() => {
          setIsInputActive(false);
          setDefaultInputValue('');
        }}
      />
      {currentObj &&
        currentObj.comments &&
        currentObj.comments.map((comment: IComment, index: number) => {
          const updatedSelectedIds = selectedCommentIds.filter(
            (commentId) => commentId !== comment.id
          );

          const selectedCommentId = selectedCommentIds.find(
            (id) => id === comment.id
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
                  placeholder="Напишіть коментар"
                  onClick={(value) => handleUpdateComment(comment.id, value)}
                  onCancel={() => setSelectedCommentIds(updatedSelectedIds)}
                  isActive={true}
                  text={comment.text}
                  buttonLabel={'Зберегти'}
                />
              </div>
            );
          } else {
            return (
              <CommentBox
                key={`${comment.id}-${index}`}
                text={comment.text}
                name={comment.name}
                timestamp={comment.timestamp}
                id={comment.id}
                userId={comment.userId}
                onDelete={handleDeleteComment}
                onEdit={handleEditComment}
                onReply={handleReplyComment}
              />
            );
          }
        })}
    </>
  );
};
