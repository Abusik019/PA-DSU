import styles from '../style.module.scss';

export const Search = ({ onInput, placeholder = '' }) => {
    return (
        <input 
            className={styles.search} 
            type="search" 
            placeholder={placeholder} 
            onInput={onInput}
        />
    )
}
