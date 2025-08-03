import { useState } from "react";
import { FloatButton } from "antd";
import { LinkBackwardIcon, TelegramIcon, VkIcon } from '../../assets';
import dguLogo from '../../assets/images/dgu.logo.2.png';

const DguLogo =  () => <img src={dguLogo} width={40} height={40} style={{position: 'absolute', left: 0, top: 0}} />

const FeedbackDropList = ({ position = 'fixed' }) => {
    const [open, setOpen] = useState(false);
    
    const handleToggle = () => {
        setOpen(!open);
    };

    const getPositionStyles = () => {
        if (position === 'absolute') {
            return {
                position: 'absolute',
                bottom: '30px',
                right: 0,
                insetInlineEnd: 'unset'
            };
        } else if (position === 'fixed') {
            return {
                position: 'fixed',
                insetInlineEnd: '24px'
            };
        }
        return {};
    };
    
    return (
        <FloatButton.Group
            open={open}
            trigger="click"
            style={getPositionStyles()}
            icon={<LinkBackwardIcon />}
            onClick={handleToggle}
        >
            <FloatButton 
                icon={<DguLogo />} 
                onClick={() => window.open('https://dgu.ru/')}
            />
            <FloatButton 
                icon={<VkIcon />} 
                onClick={() => window.open('https://vk.com/college_dsu')}
            />
            <FloatButton 
                icon={<TelegramIcon />} 
                onClick={() => window.open('https://t.me/collegedsu')}
            />
        </FloatButton.Group>
    );
};

export default FeedbackDropList;