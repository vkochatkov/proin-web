import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { changeSnackbarState } from '../../modules/actions/snackbar';
import { LinkIt, LinkItEmail, LinkItUrl } from 'react-linkify-it';

interface Props {
  text?: string;
}

const emailRegex =
  /(?:^|\s|[.,<>()[\]\\])([a-zA-Z0-9]+[\w\.-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+[\w\.-]*[a-zA-Z0-9]+\.[a-zA-Z]{2,})/g;

const phoneRegex =
  /(\+?\d{1,3}[\s.,-]*)?\(?(\d{3})\)?[\s.,-]*?(\d{3})[\s.,-]*?(\d{4})/g;
const cardRegex = /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g;
const hashtagRegex = /(^|\b)#[\w-]+(\b|$)/g;

export const ProjectTextOutput = ({ text }: Props) => {
  const dispatch = useDispatch();
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const content = event.currentTarget.textContent;

    if (content) {
      navigator.clipboard
        .writeText(content.trim())
        .then(() =>
          dispatch(
            changeSnackbarState({
              id: 'success',
              message: 'Скопійовано в буфер',
              open: true,
            })
          )
        )
        .catch((error) => console.error('Failed to copy to clipboard:', error));
    }
  };

  const linkify = (word: string, index: number) => {
    if (word.includes('http://') || word.includes('https://')) {
      return <LinkItUrl key={`${word}-${Math.random()}`}>{word}</LinkItUrl>;
    } else if (word.includes('@') && !emailRegex.test(word)) {
      return (
        <LinkIt
          component={(match, key) => (
            <a onClick={handleClick} key={`${key}-${Math.random()}`} href="#">
              {match}
            </a>
          )}
          regex={/@\w+/}
        >
          {word}
        </LinkIt>
      );
    } else if (word.match(emailRegex)) {
      return <LinkItEmail key={word}>{word}</LinkItEmail>;
    } else if (word.match(phoneRegex)) {
      return (
        <LinkIt
          component={(match, key) => (
            <>
              <a key={`${key}-${Math.random()}`} href={`tel:${match}`}>
                {match}
              </a>
            </>
          )}
          regex={phoneRegex}
        >
          {word}
        </LinkIt>
      );
    } else if (word.match(cardRegex)) {
      return (
        <LinkIt
          component={(match, key) => (
            <>
              <a onClick={handleClick} key={`${key}-${Math.random()}`} href="#">
                {match}
              </a>
            </>
          )}
          regex={cardRegex}
        >
          {word}
        </LinkIt>
      );
    } else if (word.match(hashtagRegex)) {
      return (
        <LinkIt
          component={(match, key) => (
            <a onClick={handleClick} key={`${key}-${Math.random()}`} href="#">
              {match}
            </a>
          )}
          regex={hashtagRegex}
        >
          {word}
        </LinkIt>
      );
    } else {
      return <span key={`${word}-${index}`}>{word}</span>;
    }
  };

  return (
    <>
      {text &&
        text.split('\n').map((part, index) => {
          const words = part.split(' ');

          const newLineAfterLink = part.endsWith(' ');
          const lastWordIndex = words.length - 1;

          return (
            <p key={index} style={{ textAlign: 'left', margin: '0' }}>
              {words.map((word: string, wordIndex: number) => {
                const linkElement = linkify(
                  word + ' ',
                  index * words.length + wordIndex
                );

                if (linkElement) {
                  return (
                    <Fragment key={`${word}-${wordIndex}`}>
                      {linkElement}
                    </Fragment>
                  );
                } else {
                  return (
                    <>
                      <Fragment key={`${word}-${wordIndex}`}>
                        {word}
                        {wordIndex === lastWordIndex ? '' : ' '}
                      </Fragment>
                    </>
                  );
                }
              })}
              {newLineAfterLink && <br />}
            </p>
          );
        })}
    </>
  );
};
