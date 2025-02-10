import React from 'react'
import { BackButton } from './../../components/layouts/BackButton/index';

export default function Lecture() {
  return (
    <div className='w-full h-fit flex flex-col justify-start gap-[40px] items-center pt-[100px] box-border relative'>
        <BackButton />
        <div className='w-full flex flex-col items-center'>
            <h5 className='text-gray-400 font-medium'>25 января, 2025</h5>
            <h2 className='text-black font-medium text-4xl max-w-[60%] text-center'>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</h2>
        </div>
    </div>
  )
}

// import { createEditor } from 'slate';
// import { Slate, Editable, withReact } from 'slate-react';

// const editor = useMemo(() => withReact(createEditor()), []);
// const [value, setValue] = useState(JSON.parse(textData));

// <Slate editor={editor} value={value}>
//     <Editable readOnly />
// </Slate>
