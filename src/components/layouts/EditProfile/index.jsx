import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, Input, Button, Form, Row } from "antd";
import { CloseButton } from "../CloseButton";
import { useDispatch, useSelector } from "react-redux";
import { changeMyInfo } from "../../../store/slices/users";
import { Error } from '../../common/error';
import { Success } from './../../common/success';
import Loader from "../../common/loader";

const { Item } = Form;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const EditProfile = ({ setState }) => {
    const dispatch = useDispatch();
    const myInfo = useSelector((state) => state.users.list);
    const loading = useSelector((state) => state.users.loading);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [isDone, setIsDone] = useState("");
    const [fileList, setFileList] = useState([
        {
            uid: "-1",
            name: "avatar.png",
            status: "done",
            url: myInfo.image || "",
        },
    ]);
    
    useEffect(() => {
        if (!myInfo || !myInfo.id) {
            dispatch(getMyInfo());  
        }
    }, [myInfo]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ file, fileList: newFileList }) => {
        if (file.status === "done" || file.status === "uploading") {
            const lastFile = newFileList.slice(-1)[0];
            if (lastFile.originFileObj) {
                const newImageUrl = URL.createObjectURL(lastFile.originFileObj);
                setPreviewImage(newImageUrl);
            }
        }

        if (file.status === "error") {
            file.status = "done";
        }
        setFileList(newFileList.slice(-1));
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith("image/");
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isImage) {
            alert("Можно загружать только изображения!");
            return Upload.LIST_IGNORE;
        }
        if (!isLt2M) {
            alert("Размер изображения должен быть меньше 2MB!");
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const onFinish = async (values) => {
        const formData = { ...values };
    
        if (fileList[0] && fileList[0].originFileObj) {
            formData.image = fileList[0].originFileObj;
        }
    
        try {
            await dispatch(changeMyInfo(formData)).unwrap();
            setIsDone('true');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (e) {
            console.error("Ошибка при изменении данных:", e);
            setIsDone('false');
        }
    };

    if(loading){
        return <Loader />
    }
    
    return (
        <div
            style={{
                padding: "20px",
                width: "calc(65% - 40px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "20px",
                position: "relative"
            }}
        >
            {isDone === 'true' && <Success text="Данные успешно изменены"/>}
            <Form
                layout="vertical"
                onFinish={onFinish}
                style={{ width: "400px" }}
                initialValues={{
                    first_name: myInfo.first_name,
                    last_name: myInfo.last_name,
                    email: myInfo.email,
                }}
            >
                <Row justify="center" style={{ marginBottom: 20 }}>
                    <Upload
                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                        listType="picture-circle"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        beforeUpload={beforeUpload}
                        maxCount={1}
                    >
                        {fileList.length < 1 && uploadButton}
                    </Upload>
                    {previewImage && (
                        <Image
                            wrapperStyle={{ display: "none" }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) =>
                                    setPreviewOpen(visible),
                            }}
                            src={previewImage}
                        />
                    )}
                </Row>

                <Item
                    label="Имя"
                    name="first_name"
                    rules={[
                        { required: true, message: "Пожалуйста, введите имя!" },
                    ]}
                >
                    <Input placeholder="Введите имя"/>
                </Item>

                <Item
                    label="Фамилия"
                    name="last_name"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите фамилию!",
                        },
                    ]}
                >
                    <Input placeholder="Введите фамилию"/>
                </Item>

                <Item
                    label="Электронная почта"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите почту!",
                        },
                        { type: "email", message: "Введите корректный email!" },
                    ]}
                >
                    <Input placeholder="Введите почту"/>
                </Item>

                <Item style={{ textAlign: "center", marginTop: 20 }}>
                    <Button type="primary" htmlType="submit">
                        Сохранить
                    </Button>
                </Item>
            </Form>
            {isDone === 'false' && <Error text="Ошибка изменения данных"/>}
            <CloseButton setState={setState} />
        </div>
    );
};

export default EditProfile;
