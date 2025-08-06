import classNames from 'classnames';
import { forwardRef } from 'react';
import { useOutsideClick } from '../../utils/useOutsideClick';

export const Dropdown = forwardRef(({ children, maxHeight, isOpen, tag = 'div', styles = '', onClose }, ref) => {
  const Tag = tag;

  useOutsideClick(ref, onClose);

  return (
    <Tag
      ref={ref}
      style={{ height: isOpen ? maxHeight : 'fit-content' }}
      className={classNames(styles, {
          "opacity-0 scale-y-0": !isOpen,
          "opacity-100 scale-y-100 z-[2]": isOpen
        }
      )}
    >
      {children}
    </Tag>
  )
});

Dropdown.displayName = 'Dropdown';