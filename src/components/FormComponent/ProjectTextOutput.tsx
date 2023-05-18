import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { changeSnackbarState } from '../../modules/actions/snackbar';
import { LinkIt, LinkItEmail } from 'react-linkify-it';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  text?: string;
  fieldId?: string;
}

const emailRegex =
  /(?:^|\s|[.,<>()[\]\\])([a-zA-Z0-9]+[\w-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+[\w-]*[a-zA-Z0-9]+\.[a-zA-Z]{2,})/g;

const cardRegex = /(\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b)/g;
const phoneRegex =
  /(?!\d{16})\+?\d{1,3}[\s.,-]*\(?(\d{3})\)?[\s.,-]*?(\d{3})[\s.,-]*?(\d{4})/g;
const hashtagRegex = /(^|\b)#[\w-]+(\b|$)/g;
const urlRegex =
  /https?:\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/;

export const ProjectTextOutput = ({ text, fieldId }: Props) => {
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
      return (
        <LinkIt
          key={`${word}-${uuidv4()}`}
          component={(match, key) => (
            <a
              style={{ wordBreak: 'break-all' }}
              key={`${key}-${uuidv4()}`}
              href={match}
            >
              {match}
            </a>
          )}
          regex={urlRegex}
        >
          {word}
        </LinkIt>
      );
    } else if (word.includes('@') && !emailRegex.test(word)) {
      return (
        <LinkIt
          key={`${word}-${uuidv4()}`}
          component={(match, key) => (
            <a
              style={{ wordBreak: 'break-all' }}
              onClick={handleClick}
              key={`${key}-${uuidv4()}`}
              href={'#'}
            >
              {match}
            </a>
          )}
          regex={/@\w+/}
        >
          {word}
        </LinkIt>
      );
    } else if (word.match(emailRegex)) {
      return <LinkItEmail key={uuidv4()}>{word}</LinkItEmail>;
    } else if (word.match(cardRegex)) {
      return (
        <LinkIt
          key={`${word}-${uuidv4()}`}
          component={(match, key) => (
            <>
              <a
                style={{ wordBreak: 'break-all' }}
                onClick={handleClick}
                key={`${key}-${uuidv4()}`}
                href="#"
              >
                {match}
              </a>
            </>
          )}
          regex={cardRegex}
        >
          {word}
        </LinkIt>
      );
    } else if (word.match(phoneRegex)) {
      return (
        <LinkIt
          key={`${word}-${uuidv4()}`}
          component={(match, key) => (
            <>
              <a
                style={{ wordBreak: 'break-all' }}
                key={`${key}-${uuidv4()}`}
                href={`tel:${match}`}
              >
                {match}
              </a>
            </>
          )}
          regex={phoneRegex}
        >
          {word}
        </LinkIt>
      );
    } else if (word.match(hashtagRegex)) {
      return (
        <LinkIt
          key={`${word}-${uuidv4()}`}
          component={(match, key) => (
            <a
              style={{ wordBreak: 'break-all' }}
              onClick={handleClick}
              key={`${key}-${uuidv4()}`}
              href="#"
            >
              {match}
            </a>
          )}
          regex={hashtagRegex}
        >
          {word}
        </LinkIt>
      );
    } else {
      return <span key={`${uuidv4()}-${index}`}>{word}</span>;
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
            <p
              key={index}
              style={{
                textAlign: 'left',
                margin: '0',
                fontWeight: `${fieldId === 'projectName' ? 700 : 300}`,
              }}
            >
              {words.map((word: string, wordIndex: number) => {
                const linkElement = linkify(
                  word + ' ',
                  index * words.length + wordIndex
                );

                if (linkElement) {
                  return (
                    <Fragment key={`${uuidv4()}-${wordIndex}`}>
                      {linkElement}
                    </Fragment>
                  );
                } else {
                  return (
                    <>
                      <Fragment key={`${uuidv4()}-${wordIndex}`}>
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
