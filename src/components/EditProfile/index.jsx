import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, Input, Button, Form, Row } from "antd";
import { CloseButton } from "../CloseButton";

const { Item } = Form;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const EditProfile = ({ avatar, setState }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([
        {
            uid: "-1",
            name: "avatar.png",
            status: "done",
            url: avatar,
        },
    ]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ file, fileList: newFileList }) => {
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

    const onFinish = (values) => {
        console.log("Saved values:", values);
    };

    return (
        <div
            style={{
                padding: "20px",
                width: "calc(65% - 40px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
            }}
        >
            <Form
                layout="vertical"
                onFinish={onFinish}
                style={{ width: "400px" }}
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
                    name="firstName"
                    rules={[
                        { required: true, message: "Пожалуйста, введите имя!" },
                    ]}
                >
                    <Input placeholder="Введите имя" />
                </Item>

                <Item
                    label="Фамилия"
                    name="lastName"
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

                <Item style={{ textAlign: "center", marginTop: 20 }}>
                    <Button type="primary" htmlType="submit">
                        Сохранить
                    </Button>
                </Item>
            </Form>
            <CloseButton setState={setState} />
        </div>
    );
};

export default EditProfile;
