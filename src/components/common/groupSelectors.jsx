import SelectCourse from "./selectCourse";
import SelectDirection from "./selectDirection";
import SelectGroup from "./selectGroup";

export default function GroupSelectors({ filterGroup, setFilterGroup }) {
    return (
        <>
            <SelectDirection
                setFilterGroup={setFilterGroup}
                value={filterGroup.direction.label}
            />
            <SelectCourse
                setFilterGroup={setFilterGroup}
                value={filterGroup.course.label}
            />
            <SelectGroup
                setFilterGroup={setFilterGroup}
                value={filterGroup.group.label}
            />
        </>
    );
}
