import React from 'react';

interface IProps {
  parentCommentId: string;
  replyUser?: string;
  replyUserCommentText?: string;
}

export const ReplyCommentComponent: React.FC<IProps> = ({
  parentCommentId,
  replyUser,
  replyUserCommentText,
}) => {
  const isCommentRemoved =
    parentCommentId && !replyUser && !replyUserCommentText;
  const scrollToComment = (commentId: string) => {
    const targetElement = document.getElementById(commentId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth', // This enables smooth scrolling
        block: 'start', // Scroll to the top of the target element
      });
    }
  };
  return (
    <>
      {isCommentRemoved && (
        <p className='comment__reply-wrapper'>Коментар видалено</p>
      )}
      {!isCommentRemoved && (
        <a
          className='comment__reply-wrapper'
          href={`#comment-${parentCommentId}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToComment(`comment-${parentCommentId}`);
          }}
        >
          <h6 className='comment__reply-text'>{replyUser}</h6>
          <p className='comment__reply-text'>{replyUserCommentText}</p>
        </a>
      )}
    </>
  );
};
