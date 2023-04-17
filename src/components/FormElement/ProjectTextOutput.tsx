import { Fragment } from 'react';

interface Props {
  text?: string;
}

export const ProjectTextOutput = ({ text }: Props) => {
  const linkRegex = /((?:https?:\/\/|www\.)[^\s\n]+)/g; // Regular expression to match links and new lines
  const parts = text ? text.split('\n') : null;

  return (
    <>
      {parts &&
        parts.map((part, index) => {
          if (!part) return null;
          if (part.match(linkRegex)) {
            const words = part.split(' ');
            const linkIndex = words.findIndex(
              (word) =>
                word.startsWith('http://') || word.startsWith('https://')
            );

            return words.map((word, index) => (
              <Fragment key={index}>
                {index === linkIndex ? (
                  <>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={word}
                      style={{
                        wordBreak: 'break-all',
                      }}
                    >
                      {word}
                    </a>{' '}
                  </>
                ) : (
                  <>{word} </>
                )}
              </Fragment>
            ));
          } else {
            return (
              <p key={index} style={{ textAlign: 'left', margin: '0' }}>
                {part}
              </p>
            );
          }
        })}
    </>
  );
};
