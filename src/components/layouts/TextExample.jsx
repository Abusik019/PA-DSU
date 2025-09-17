import React, { useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";

export default function TextExample({ setText }) {
    const [value, setValue] = React.useState("**Hello world!!!**");

    useEffect(() => {
        setText(value);
    }, [setText, value]);

    return (
        <div
            className="container markdown h-full flex flex-row gap-2 max-sm:flex-col max-sm:mb-20"
            data-color-mode="light"
        >
            <div className="border border-black h-full w-[60%] rounded-lg overflow-hidden max-sm:w-full">
                <MDEditor
                    value={value}
                    onChange={setValue}
                    preview="edit"
                    className="w-full"
                    height={"100%"}
                />
            </div>
            <MDEditor.Markdown
                source={value}
                className="border border-black h-full w-[40%] p-3 box-border rounded-lg max-sm:w-full"
            />
        </div>
    );
}
