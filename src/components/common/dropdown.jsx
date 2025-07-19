import classNames from 'classnames';

export const Dropdown = ({ children, maxHeight, isOpen, dropdownRef }) => {
  return (
    <div 
      ref={dropdownRef} 
      style={{height: isOpen ? maxHeight : 'fit-content'}} 
      className={classNames(
        "w-[170px] h-fit bg-white shadow-lg rounded-lg absolute top-[50px] left-0 overflow-hidden p-5 px-[10px] box-border flex flex-col items-center justify-between transition-all duration-300 origin-top",
        {
          "opacity-0 scale-y-0": !isOpen,
          "opacity-100 scale-y-100 z-[2]": isOpen
        }
      )}
    >
        {children}
    </div>
  )
}
