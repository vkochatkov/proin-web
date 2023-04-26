import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommentBox } from './FormComponent/CommentBox';
import { CommentInput } from './FormComponent/CommentInput';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from '../modules/selectors/user';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import {
  deleteComment,
  setCurrentProject,
  createProjectComments,
  updateComment,
} from '../modules/actions/mainProjects';
import { IComment } from '../modules/reducers/mainProjects';

export const CommentsList = () => {
  const dispatch = useDispatch();
  const auth = useSelector(getAuth);
  const currentProject = useSelector(getCurrentProject);
  const [selectedCommentIds, setSelectedCommentIds] = React.useState<string[]>([
    '',
  ]);
  const [defaultInputValue, setDefaultInputValue] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);

  const handleCreatingComment = (value: string) => {
    if (!currentProject) return;

    const id = uuidv4();

    const mentionRegex = /@[a-zA-Z0-9_]+/;
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

    dispatch(
      createProjectComments({
        comment,
      }) as any
    );

    setIsInputActive(false);
  };

  const handleDeleteComment = (id: string) => {
    if (!currentProject) return;

    const { comments } = currentProject;

    if (comments) {
      const updatedComments = comments.filter((comment) => comment.id !== id);
      const updatedProject = {
        ...currentProject,
        comments: updatedComments,
      };

      dispatch(deleteComment(id) as any);
      dispatch(setCurrentProject(updatedProject));
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
    if (!currentProject) return;

    const { comments } = currentProject;
    let updatedComment;

    if (!comments) return;

    const updatedComments = comments.map((comment) => {
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

    dispatch(updateComment({ updatedComments, updatedComment }) as any);
    setSelectedCommentIds(updatedSelectedIds);
  };

  return (
    <>
      <CommentInput
        onClick={handleCreatingComment}
        isActive={isInputActive}
        text={defaultInputValue}
        onCancel={() => {
          setIsInputActive(false);
          setDefaultInputValue('');
        }}
      />
      {currentProject &&
        currentProject.comments &&
        currentProject.comments.map((comment, index) => {
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
                <CommentInput
                  onClick={(value) => handleUpdateComment(comment.id, value)}
                  onCancel={() => setSelectedCommentIds(updatedSelectedIds)}
                  isActive={true}
                  text={comment.text}
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
