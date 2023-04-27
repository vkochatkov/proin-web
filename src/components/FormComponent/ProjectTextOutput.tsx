import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { changeSnackbarState } from '../../modules/actions/snackbar';
import { Link } from './ProjectTextLink';

interface Props {
  text?: string;
}

const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
const phoneRegex =
  /(\+?\d{1,3}[\s.,-]*)?\(?(\d{3})\)?[\s.,-]*?(\d{3})[\s.,-]*?(\d{4})/g;
const cardRegex = /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g;
const hashtagRegex = /#\w+/g;

export const ProjectTextOutput = ({ text }: Props) => {
  const dispatch = useDispatch();
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const content = event.currentTarget.textContent;

    if (content) {
      navigator.clipboard
        .writeText(content)
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
    const match = word.match(/^(.*?)([.,]?)(\s*)$/);
    let linkText;
    let punctuation;
    let whitespace;

    if (word.startsWith('http://') || word.startsWith('https://')) {
      if (match) {
        linkText = match[1];
        punctuation = match[2];
        whitespace = match[3];
        return (
          <>
            <Link key={`${word}-${Math.random()}`} href={linkText}>
              {linkText}
            </Link>
            {punctuation}
            {whitespace}
          </>
        );
      }
    } else if (word.startsWith('@')) {
      if (match) {
        linkText = match[1];
        punctuation = match[2];
        whitespace = match[3];
        return (
          <>
            <Link
              onClick={handleClick}
              key={`${word}-${Math.random()}`}
              href="#"
            >
              {linkText}
            </Link>
            {punctuation}
            {whitespace}
          </>
        );
      }
    } else if (word.match(emailRegex)) {
      if (match) {
        linkText = match[1];
        punctuation = match[2];
        whitespace = match[3];
        return (
          <>
            <Link key={`${word}-${Math.random()}`} href={`mailto:${linkText}`}>
              {linkText}
            </Link>
            {punctuation}
            {whitespace}
          </>
        );
      }
    } else if (word.match(phoneRegex)) {
      if (match) {
        linkText = match[1];
        punctuation = match[2];
        whitespace = match[3];
        return (
          <>
            <Link key={`${word}-${Math.random()}`} href={`tel:${linkText}`}>
              {linkText}
            </Link>
            {punctuation}
            {whitespace}
          </>
        );
      }
    } else if (word.match(cardRegex)) {
      if (match) {
        linkText = match[1];
        punctuation = match[2];
        whitespace = match[3];
        return (
          <>
            <Link
              onClick={handleClick}
              key={`${word}-${Math.random()}`}
              href="#"
            >
              {linkText}
            </Link>
            {punctuation}
            {whitespace}
          </>
        );
      }
    } else if (word.match(hashtagRegex)) {
      if (match) {
        linkText = match[1];
        punctuation = match[2];
        whitespace = match[3];
        return (
          <>
            <Link
              onClick={handleClick}
              key={`${word}-${Math.random()}`}
              href="#"
            >
              {linkText}
            </Link>
            {punctuation}
            {whitespace}
          </>
        );
      }
    } else {
      return <span key={`${word}-${index}`}>{word} </span>;
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
                  word,
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
