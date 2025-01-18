import { Checkbox } from 'antd';

const onChange = (e) => {
  console.log(`checked = ${e.target.checked}`);
};

const SortCheckbox = ({value}) => <Checkbox onChange={onChange}>{value}</Checkbox>;
export default SortCheckbox;