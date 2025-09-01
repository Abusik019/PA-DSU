import boxImg from '../../assets/images/box.gif';

export default function NotData({ text = '', imgSize = 128 }) {
    return (
        <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3 max-sm:text-center">
            <h2 className="text-3xl">{text}</h2>
            <img src={boxImg} width={imgSize} height={imgSize} alt="box" />
        </div>
    )
}
