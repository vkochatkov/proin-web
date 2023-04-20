interface Props {
  href: string;
  children: React.ReactNode;
  onClick?: (event: any) => void;
}

export const Link = ({ href, onClick, children }: Props) => (
  <a
    onClick={onClick}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{ wordBreak: 'break-all' }}
  >
    {children}{' '}
  </a>
);
