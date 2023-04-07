import { useDispatch, useSelector } from 'react-redux';
import { CommentBox } from './FormElement/CommentBox';
import { CommentInput } from './FormElement/CommentInput';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from '../modules/selectors/user';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import {
  addCommentToCurrentProject,
  setCurrentProject,
} from '../modules/actions/mainProjects';

export const CommentsList = () => {
  const dispatch = useDispatch();
  const auth = useSelector(getAuth);
  const currentProject = useSelector(getCurrentProject);

  const handleCreatingComment = (value: string) => {
    if (!currentProject) return;

    const id = uuidv4();
    const userName = auth.email.split('@')[0];
    const comment = {
      id,
      text: value,
      name: userName,
      timestamp: new Date().toISOString(),
    };

    dispatch(
      addCommentToCurrentProject({ comment, projectId: currentProject._id })
    );
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

      dispatch(setCurrentProject(updatedProject));
    }
  };

  const handleEditComment = (id: string) => {};

  return (
    <>
      <CommentInput onClick={handleCreatingComment} />
      {currentProject &&
        currentProject.comments &&
        currentProject.comments.map((comment, index) => (
          <CommentBox
            key={comment.id}
            text={comment.text}
            name={comment.name}
            timestamp={comment.timestamp}
            id={comment.id}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        ))}
    </>
  );
};
