import styles from './style.module.scss';

export const Dropdown = ({ children, maxHeight, isOpen, dropdownRef }) => {
  return (
    <div ref={dropdownRef} style={{height: isOpen ? maxHeight : 'fit-content'}} className={`${styles.dropdown} ${isOpen ? styles.visible : ''}`}>
        {children}
    </div>
  )
}
