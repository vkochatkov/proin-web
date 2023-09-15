import { useDispatch, useSelector } from 'react-redux';
import { CommentsList } from './CommentsList';
import { getCurrentTask } from '../modules/selectors/currentTask';
import { IComment } from '../modules/reducers/mainProjects';
import { updateTaskState } from '../modules/actions/currentTask';
import {
  createTaskComment,
  deleteTaskComment,
  updateTaskById,
} from '../modules/actions/tasks';
import { useParams } from 'react-router-dom';
import { ITask } from '../modules/types/tasks';
import { closeModal } from '../modules/actions/modal';
import { getIdForRemove } from '../modules/selectors/idForRemove';
import { setIdForDelete } from '../modules/actions/idForRemove';
import { RemoveModal } from './Modals/RemoveModal';

interface IProps {
  currentObj: any;
}

export const TaskCommentsComponent: React.FC<IProps> = ({ currentObj }) => {
  const dispatch = useDispatch();
  const currentTask = useSelector(getCurrentTask);
  const modalId = 'remove-task-comment';
  const { tid } = useParams();
  const removedItemId = useSelector(getIdForRemove);

  const handeSaveUpdatedComment = (
    updatedComment: IComment,
    updatedComments: IComment[],
  ) => {
    if (!updatedComment.taskId) return;

    const task = { comments: updatedComments };

    dispatch(updateTaskState({ task }));

    dispatch(
      updateTaskById(
        { comments: updatedComments, comment: updatedComment },
        updatedComment.taskId,
      ) as any,
    );
  };

  const handleSaveDeletedComment = ({
    id,
  }: {
    id: string;
    updatedObj: ITask;
  }) => {
    if (!tid) return;

    dispatch(deleteTaskComment(tid, id) as any);
  };

  const handleSaveCreatedComment = (comment: IComment) => {
    if (!tid) return;

    dispatch(createTaskComment({ ...comment, taskId: tid }, tid) as any);
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
      <CommentsList
        currentObj={currentTask}
        modalId={modalId}
        updateComment={handeSaveUpdatedComment}
        createComment={handleSaveCreatedComment}
      />
    </>
  );
};
