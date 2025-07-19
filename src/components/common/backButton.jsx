import { useNavigate } from 'react-router-dom';
import styles from '../style.module.scss';

export const BackButton = ({ path = '', onClick }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(path ? path : -1);  
  };

  return (
    <button 
      onClick={onClick ? onClick : goBack} 
      className={`absolute left-0 top-5 pr-[25px] box-border text-left text-[#444BE6] font-semibold ${styles.backBtn}`}
    >
      Назад
    </button>
  )
}
