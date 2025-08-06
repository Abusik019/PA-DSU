import { BookEditIcon, FileIcon } from '../../assets';
import { BackButton } from '../../components/common/backButton';

export default function ChooseTypeLecture({ setTypeLecture }) {
    return (
        <div className="w-full h-full flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border relative">
            <BackButton onClick={() => setTypeLecture("")} />
            <div className="w-full flex justify-between items-center">
                <h1 className="text-5xl">Выберите способ создания лекции</h1>
            </div>
            <div
                style={{ height: "calc(100% - 164px)" }}
                className="w-full overflow-y-auto flex items-center justify-center gap-[30px]"
            >
                <div 
                    className="border-[1px] border-gray-300 rounded-xl px-4 py-8 box-border flex items-center gap-3 text-xl cursor-pointer w-[310px] transition-all hover:border-black"
                    onClick={() => setTypeLecture('file')}
                >
                    <FileIcon />
                    <h2>Загрузить файл</h2>
                </div>
                <div 
                    className="border-[1px] border-gray-300 rounded-xl px-4 py-8 box-border flex items-center gap-3 text-xl cursor-pointer w-[310px] transition-all hover:border-black"
                    onClick={() => setTypeLecture('text')}
                >
                    <BookEditIcon />
                    <h2>Написать в редакторе</h2>
                </div>
            </div>
        </div>
    );
}
