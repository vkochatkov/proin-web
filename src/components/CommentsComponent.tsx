import { useDispatch, useSelector } from 'react-redux';
import {
  createProjectComment,
  deleteComment,
  setCurrentProject,
  updateComment,
} from '../modules/actions/mainProjects';
import { IComment } from '../modules/reducers/mainProjects';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { CommentsList } from './CommentsList';

export const CommentsComponent = () => {
  const dispatch = useDispatch();
  const currentProject = useSelector(getCurrentProject);

  const handleSaveDeletedComment = ({
    id,
    updatedObj,
  }: {
    id: string;
    updatedObj: any;
  }) => {
    dispatch(deleteComment(id) as any);
    dispatch(setCurrentProject(updatedObj));
  };

  const handeSaveUpdatedComment = (
    updatedComment: IComment,
    updatedComments: IComment[],
  ) => {
    dispatch(updateComment({ updatedComments, updatedComment }) as any);
  };

  const handleSaveCreatedComment = (comment: IComment) => {
    dispatch(
      createProjectComment({
        comment,
      }) as any,
    );
  };

  return (
    <>
      <h3>Коментарі</h3>
      <CommentsList
        currentObj={currentProject}
        deleteComment={handleSaveDeletedComment}
        updateComment={handeSaveUpdatedComment}
        createComment={handleSaveCreatedComment}
      />
    </>
  );
};
