import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

export const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);  
  };

  return (
    <button onClick={goBack} className={styles.backLink}>Назад</button>
  )
}
