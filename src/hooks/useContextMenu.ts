import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLongPress } from 'react-use';
import { selectProject } from '../modules/actions/mainProjects';
import { openModal } from '../modules/actions/modal';
import { RootState } from '../modules/store/store';

export const useContextMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const dispatch = useDispatch();
  const dragging = useSelector((state: RootState) => state.dragging);

  const handleContextMenu = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (dragging) return;

    const target = event.currentTarget || event.target;

    setAnchorEl(target);
    setContextMenuPosition({
      top: event.clientY || event.touches[0].clientY,
      left: event.clientX || event.touches[0].clientX,
    });
  };

  const defaultOptions = {
    isPreventDefault: false,
    delay: 500,
  };

  const longPressProps = useLongPress(handleContextMenu, {
    ...defaultOptions,
  });

  const handleSelectProject = (id: string, modalId: string) => {
    dispatch(selectProject(id));
    dispatch(openModal({ id: modalId }));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return {
    longPressProps,
    handleClose,
    contextMenuPosition,
    anchorEl,
    handleSelectProject,
    handleContextMenu,
  };
};
