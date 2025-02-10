import React, { useState } from 'react'
import TextLecture from './textLecture';
import FileLecture from './fileLecture';
import ChooseTypeLecture from './chooseTypeLecture';
import LectureInfo from './lectureInfo';

export default function CreateLecture() {
    const   [typeLecture, setTypeLecture] = useState(''),
            [lecture, setLecture] = useState({
                title: "",
                group: [],
                file: "",
                text: ""
            })

    console.log(lecture);

    function showComponents(){
        switch (typeLecture) {
            case "text":
                return <TextLecture setTypeLecture={setTypeLecture}/>;
            case "file":
                return <FileLecture setTypeLecture={setTypeLecture} setLecture={setLecture} lecture={lecture}/>;
            case "lecture_type":
                return <ChooseTypeLecture typeLecture={typeLecture} setTypeLecture={setTypeLecture}/>;
            default:
                return <LectureInfo setTypeLecture={setTypeLecture} setLecture={setLecture} lecture={lecture}/>
        }
    }

    return (
        <>
            {showComponents()}
        </>
    )
}
