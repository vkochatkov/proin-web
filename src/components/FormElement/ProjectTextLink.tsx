interface Props {
  href: string;
  children: React.ReactNode;
}

export const Link = ({ href, children }: Props) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{ wordBreak: 'break-all' }}
  >
    {children}{' '}
  </a>
);
