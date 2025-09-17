import styles from '../style.module.scss';

export const Search = ({ onInput, placeholder = '' }) => {
    return (
        <input 
            className={`${styles.search} max-sm:row-start-2`} 
            type="search" 
            placeholder={placeholder} 
            onInput={onInput}
        />
    )
}
