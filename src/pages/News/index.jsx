import { useState } from 'react';
import filterImg from '../../assets/icons/filter2.svg';
import sortImg from "../../assets/icons/filter.svg";
import violetSortImg from "../../assets/icons/violetFilter.svg";
import ActionButton from '../../components/common/groupsAction';

export default function News() {
    const   [isHoverBtn, setIsHoverBtn] = useState(false),
            [isFilterDropdown, setIsFilterDropdown] = useState(false);

    return (
        <div className="w-full h-full overflow-hidden flex flex-col items-center">
            <div className="w-full pt-12 box-border">
                <h1 className="text-5xl">Новости</h1>
                <div className='w-full flex items-center justify-between mt-5'>
                     <ActionButton
                        isHover={isHoverBtn}
                        onClick={() => setIsFilterDropdown(true)}
                        onMouseEnter={() => setIsHoverBtn(true)}
                        onMouseLeave={() => setIsHoverBtn(false)}
                        activeIcon={violetSortImg}
                        inactiveIcon={sortImg}
                        label="Сортировать"
                        disabled={isFilterDropdown}
                    />
                    <button>
                        <img src={filterImg} width={28} height={28} alt="filter" />
                    </button>
                </div>
                <div className="w-full h-[2px] bg-black rounded-lg mt-8"></div>
            </div>
            {/* <div
                style={{ height: "calc(100% - 138px)" }}
                className="w-full flex flex-col items-center gap-10 pt-8 box-border"
            >
            </div> */}
        </div>
    );
}
