import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommentsList } from './CommentsList';
import { useParams } from 'react-router-dom';
import { RemoveModal } from './Modals/RemoveModal';
import { IComment } from '../modules/types/mainProjects';
import { ITransaction } from '../modules/types/transactions';
import { getIdForRemove } from '../modules/selectors/idForRemove';
import { setIdForDelete } from '../modules/actions/idForRemove';
import { createTransactionComment } from '../modules/actions/transactions';

interface IProps {
  currentObj: ITransaction;
}

export const TransactionCommentsComponent: React.FC<IProps> = ({
  currentObj,
}) => {
  const dispatch = useDispatch();
  const { transactionId } = useParams();
  const removedItemId = useSelector(getIdForRemove);

  const handeSaveUpdatedComment = (
    updatedComment: IComment,
    updatedComments: IComment[],
  ) => {
    if (!currentObj || !transactionId) return;

    // const task = { comments: updatedComments };
    // dispatch(
    //   updateTaskById(
    //     { comments: updatedComments, comment: updatedComment },
    //     transactionId,
    //   ) as any,
    // );
  };

  const handleSaveDeletedComment = (id: string) => {
    if (!transactionId || !currentObj) return;

    // dispatch(deleteTaskComment(transactionId, id) as any);
  };

  const handleCreateComment = (comment: IComment) => {
    if (!transactionId) return;

    dispatch(
      createTransactionComment(
        { ...comment, transactionId },
        transactionId,
      ) as any,
    );
  };

  const handleDeleteComment = () => {
    if (!currentObj || !removedItemId) return;

    const { comments } = currentObj;
    if (comments) {
      handleSaveDeletedComment(removedItemId);
    }

    dispatch(setIdForDelete(''));
  };

  return (
    <>
      <RemoveModal
        modalId='remove-task-comment'
        submitHandler={handleDeleteComment}
        text='коментар'
      />
      <CommentsList
        currentObj={currentObj}
        modalId='remove-task-comment'
        updateComment={handeSaveUpdatedComment}
        createComment={handleCreateComment}
      />
    </>
  );
};
