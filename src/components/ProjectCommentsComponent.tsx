import { useDispatch, useSelector } from 'react-redux';
import {
  createProjectComment,
  deleteComment,
  setCurrentProject,
  updateComment,
} from '../modules/actions/mainProjects';
import { IComment } from '../modules/reducers/mainProjects';
import { CommentsList } from './CommentsList';
import { RemoveModal } from './Modals/RemoveModal';
import { getIdForRemove } from '../modules/selectors/idForRemove';
import { closeModal } from '../modules/actions/modal';
import { setIdForDelete } from '../modules/actions/idForRemove';

interface IProps {
  currentObj: any;
}

export const ProjectCommentsComponent: React.FC<IProps> = ({ currentObj }) => {
  const dispatch = useDispatch();
  const modalId = 'remove-project-comment';
  const removedItemId = useSelector(getIdForRemove);

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

  const handleDeleteComment = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!currentObj) return;
    const { comments } = currentObj;
    if (comments) {
      dispatch(
        closeModal({
          id: modalId,
        }),
      );
      const updatedComments = comments.filter(
        (comment: IComment) => comment.id !== removedItemId,
      );
      const updatedObj = {
        ...currentObj,
        comments: updatedComments,
      };
      handleSaveDeletedComment({
        id: removedItemId,
        updatedObj,
      });
      dispatch(setIdForDelete(''));
    }
  };

  return (
    <>
      <RemoveModal
        modalId={modalId}
        submitHandler={handleDeleteComment}
        text={'коментар'}
      />
      <h3>Коментарі</h3>
      <CommentsList
        modalId={modalId}
        currentObj={currentObj}
        updateComment={handeSaveUpdatedComment}
        createComment={handleSaveCreatedComment}
      />
    </>
  );
};
