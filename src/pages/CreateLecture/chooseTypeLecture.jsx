import './style.css';
import bookEdit from '../../assets/icons/book-edit.svg';
import file from '../../assets/icons/file.svg';

export default function ChooseTypeLecture({ setTypeLecture }) {
    return (
        <div className="w-full h-full flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border relative">
            <button className="backLink" onClick={() => setTypeLecture("")}>
                Назад
            </button>
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
                    <img 
                        src={file}
                        width={48}
                        height={48}
                        alt="file"
                    />
                    <h2>Загрузить файл</h2>
                </div>
                <div 
                    className="border-[1px] border-gray-300 rounded-xl px-4 py-8 box-border flex items-center gap-3 text-xl cursor-pointer w-[310px] transition-all hover:border-black"
                    onClick={() => setTypeLecture('text')}
                >
                    <img 
                        src={bookEdit}
                        width={48}
                        height={48}
                        alt="book"
                    />
                    <h2>Написать в редакторе</h2>
                </div>
            </div>
        </div>
    );
}
