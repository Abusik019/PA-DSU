import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

export const BackButton = ({ path = '' }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(path ? path : -1);  
  };

  return (
    <button onClick={goBack} className={styles.backLink}>Назад</button>
  )
}
