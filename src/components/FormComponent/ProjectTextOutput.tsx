import { useDispatch } from 'react-redux';
import { changeSnackbarState } from '../../modules/actions/snackbar';
import { Link } from './ProjectTextLink';

interface Props {
  text?: string;
}

const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
const phoneRegex =
  /(\+?\d{1,3}[\s.-]?)?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})/g;
const cardRegex = /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g;

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
    if (word.startsWith('http://') || word.startsWith('https://')) {
      return (
        <Link key={`${word}-${index}`} href={word}>
          {word}
        </Link>
      );
    } else if (word.startsWith('@')) {
      return (
        <Link onClick={handleClick} key={`${word}-${index}`} href="#">
          {word}
        </Link>
      );
    } else if (word.match(emailRegex)) {
      return (
        <Link key={`${word}-${index}`} href={`mailto:${word}`}>
          {word}
        </Link>
      );
    } else if (word.match(phoneRegex)) {
      return (
        <Link key={`${word}-${index}`} href={`tel:${word}`}>
          {word}
        </Link>
      );
    } else if (word.match(cardRegex)) {
      return (
        <Link onClick={handleClick} key={`${word}-${index}`} href="#">
          {word}
        </Link>
      );
    } else {
      return <span>{word} </span>;
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
                  return linkElement;
                } else {
                  return (
                    <>
                      {word}
                      {wordIndex === lastWordIndex ? '' : ' '}
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
