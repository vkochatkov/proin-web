import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateTaskState } from '../modules/actions/currentTask';
import {
  createTaskComment,
  deleteTaskComment,
  updateTaskById,
} from '../modules/actions/tasks';
import { IComment } from '../modules/reducers/mainProjects';
import { getCurrentTask } from '../modules/selectors/currentTask';
import { ITask } from '../modules/types/tasks';
import { CommentsList } from './CommentsList';
import { TabsMenu } from './TabsMenu/TabsMenu';
import { UserActivityDiary } from './UserActivityDiary';

export const TaskTabsMenu = () => {
  const dispatch = useDispatch();
  const currentTask = useSelector(getCurrentTask);
  const tabsId = 'task-tabs';
  const { tid } = useParams();

  const handeSaveUpdatedComment = (
    updatedComment: IComment,
    updatedComments: IComment[]
  ) => {
    if (!updatedComment.taskId) return;

    const task = { comments: updatedComments };

    dispatch(updateTaskState({ task }));

    dispatch(
      updateTaskById(
        { comments: updatedComments, comment: updatedComment },
        updatedComment.taskId
      ) as any
    );
  };

  const handleSaveDeletedComment = ({
    id,
    updatedObj,
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

  const tabs = [
    {
      label: 'Коментарі',
      panel: (
        <CommentsList
          currentObj={currentTask}
          updateComment={handeSaveUpdatedComment}
          deleteComment={handleSaveDeletedComment}
          createComment={handleSaveCreatedComment}
        />
      ),
    },
    {
      label: 'Щоденник',
      panel: <UserActivityDiary />,
    },
  ];

  return <TabsMenu tabs={tabs} tabsId={tabsId} />;
};
