import { useDispatch, useSelector } from 'react-redux';
import { CommentBox } from './FormElement/CommentBox';
import { CommentInput } from './FormElement/CommentInput';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from '../modules/selectors/user';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { addCommentToCurrentProject } from '../modules/actions/mainProjects';

export const CommentsList = () => {
  const dispatch = useDispatch();
  const auth = useSelector(getAuth);
  const currentProject = useSelector(getCurrentProject);

  const handleSavingComment = (value: string) => {
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

  return (
    <>
      <CommentInput onClick={handleSavingComment} />
      {currentProject &&
        currentProject.comments &&
        currentProject.comments.map((comment, index) => (
          <CommentBox
            key={comment.id}
            text={comment.text}
            name={comment.name}
            timestamp={comment.timestamp}
          />
        ))}
    </>
  );
};
