import { Item } from 'react-photoswipe-gallery';
import { IFile } from '../modules/types/mainProjects';

interface IProps {
  image: IFile;
}

export const CommentImages: React.FC<IProps> = ({ image }) => {
  return (
    <>
      <Item
        original={image.url}
        thumbnail={image.url}
        width={image.width}
        height={image.height}
      >
        {({ ref, open }) => (
          <img
            //@ts-ignore
            ref={ref}
            onClick={open}
            src={image.url}
            alt={image.name}
          />
        )}
      </Item>
    </>
  );
};
