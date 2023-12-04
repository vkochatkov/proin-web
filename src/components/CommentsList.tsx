import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IComment } from '../modules/types/mainProjects';
import { FilePickerRefProvider } from './ContextProvider/FilesPickerRefProvider';
import { getIsCommentLoading } from '../modules/selectors/loading';
import { CommentSceleton } from './CommentSceleton';
import { CommentInputWithFiles } from './CommentInputWithFiles';
import { EdittedComment } from './EdittedComment';
import { useSelector } from 'react-redux';

import './CommentsList.scss';

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
  const [defaultInputValue, setDefaultInputValue] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const isCommentLoading = useSelector(getIsCommentLoading);
  const [isInputActive, setIsInputActive] = useState<boolean>(false);

  return (
    <FilePickerRefProvider>
      <CommentInputWithFiles
        currentObj={currentObj}
        selectedParentId={selectedParentId}
        defaultInputValue={defaultInputValue}
        setSelectedParentId={setSelectedParentId}
        createComment={createComment}
        setDefaultInputValue={setDefaultInputValue}
        setIsInputActive={setIsInputActive}
        isInputActive={isInputActive}
      />
      {isCommentLoading && <CommentSceleton />}
      {currentObj &&
        currentObj.comments &&
        currentObj.comments.map((comment: IComment) => (
          <EdittedComment
            key={uuidv4()}
            currentObj={currentObj}
            updateComment={updateComment}
            setSelectedParentId={setSelectedParentId}
            modalId={modalId}
            setDefaultInputValue={setDefaultInputValue}
            setIsInputActive={setIsInputActive}
            comment={comment}
          />
        ))}
    </FilePickerRefProvider>
  );
};
