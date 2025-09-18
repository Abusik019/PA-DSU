import { useState, useCallback } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Image, Upload, Input, Button, Form, Row, message } from "antd";
import Loader from "../common/loader";
import { changeMyInfo } from "../../store/slices/users";
import { CloseButton } from "../common/closeButton";
import { useScreenWidth } from "../../providers/ScreenWidthProvider";

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
    const windowWidth = useScreenWidth();
    const myInfo = useSelector((state) => state.users.list);
    const loading = useSelector((state) => state.users.loading);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState(myInfo.image ? [
        {
            uid: "-1",
            name: "avatar.png",
            status: "done",
            url: myInfo.image || "",
        },
    ] : []);

    const [form] = Form.useForm()

    const handlePreview = useCallback(async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    }, []);

    const handleChange = useCallback(({ fileList: newFileList }) => {
        setFileList(newFileList.slice(-1));
    }, []);

    const beforeUpload = useCallback((file) => {
        const isImage = file.type.startsWith("image/");
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isImage) {
            message.error("Можно загружать только изображения!");
            return Upload.LIST_IGNORE;
        }
        if (!isLt2M) {
            message.error("Размер изображения должен быть меньше 2MB!");
            return Upload.LIST_IGNORE;
        }
        return true;
    }, []);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const formData = { ...values, image: fileList[0]?.originFileObj };
            await dispatch(changeMyInfo(formData)).unwrap();
            message.info('Пользователь был обновлен');
            setTimeout(() => {
                setState(false);
            }, 2000);
            
        } catch (error) {
            console.error(error);
            message.error('Ошибка при обновлении');
        }
    };

    if (loading) return <Loader />;

    return (
        <div
            style={{
                padding: "20px",
                width: `${windowWidth > 640 ? "calc(65% - 40px)" : "100%"} `,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "20px",
                position: "relative",
            }}
        >
            <Form
                form={form}
                layout="vertical"
                style={{ width: "400px" }}
                initialValues={{
                    first_name: myInfo.first_name,
                    last_name: myInfo.last_name,
                    email: myInfo.email,
                }}
            >
                <Row justify="center" style={{ marginBottom: 20 }}>
                    <Upload
                        action="#"
                        listType="picture-circle"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        beforeUpload={beforeUpload}
                        maxCount={1}
                    >
                        {fileList.length < 1 && (
                            <div>
                                <PlusOutlined />
                                <div className="mt-2">Upload</div>
                            </div>
                        )}
                    </Upload>
                    {previewImage && (
                        <Image
                            wrapperStyle={{ display: "none" }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: setPreviewOpen,
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
                    <Input placeholder="Введите имя" />
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
                    <Input placeholder="Введите фамилию" />
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
                    <Input placeholder="Введите почту" />
                </Item>

                <Item className="text-center mt-5">
                    <Button type="primary" onClick={handleSubmit}>
                        Сохранить
                    </Button>
                </Item>
            </Form>
            <CloseButton onClick={() => setState(false)} />
        </div>
    );
};

export default EditProfile;
