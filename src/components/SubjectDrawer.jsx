import React, { useState, useEffect } from "react";
import 'antd/dist/antd.css';
import { Drawer, Form, Button, Input, Select, Upload } from 'antd';
import { getCookie } from "../controllers/localStorage.js";
import { toast } from "react-toastify";
import axios from "axios";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const layout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 18
    }
};

const validateMessages = {
    required: "${label} is required!",
};


const SubjectDrawer = ({ load, setLoad, visible, setVisible, subject, setSubject }) => {
    const [loading, setLoading] = useState(false);
    const [loadingTeacher, setLoadingTeacher] = useState(true);
    const [form] = Form.useForm();

    const [teachers, setTeachers] = useState([]);

    const onClose = () => {
        setSubject({});
        setFileList([]);
        form.resetFields();
        setVisible(false);
    };

    async function readFileAsDataURL(file) {
        let result_base64 = await new Promise((resolve) => {
            let fileReader = new FileReader();
            fileReader.onload = (e) => resolve(fileReader.result);
            fileReader.readAsText(file);
        });
        return result_base64;
    }

    const onFinish = async (values) => {
        if (fileList.length > 0) {
            let text = await readFileAsDataURL(values.data.file)
            let data = JSON.parse(text);
            values = {
                name: values.name,
                idLecture: values.idLecture,
                studentIds: values.studentIds,
                quizBank: data.quizBank,
                timelines: data.timelines
            }
        } else {
            values = {
                name: values.name,
                idLecture: values.idLecture,
                studentIds: values.studentIds
            }
        }
        setLoading(true);
        const token = getCookie("token");
        if (!subject._id) {
            createSubject(token, values);

        } else {
            updateSubject(token, values);
        }

    }

    const updateSubject = (token, values) => {
        axios
            .put(`${process.env.REACT_APP_API_URL}/subject/${subject._id}`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                toast.success(res.data.message);
                setLoad(!load);
                setLoading(false);
                setVisible(false);
                setSubject({});
                form.resetFields();
            }).catch(error => {
                toast.error(error.response.data.message);
                setLoading(false);
            });
    }

    const createSubject = (token, values) => {
        axios
            .post(`${process.env.REACT_APP_API_URL}/subject/`, values, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                toast.success(res.data.message);
                setLoad(!load);
                setLoading(false);
                setVisible(false);
                form.resetFields();
            }).catch(error => {
                toast.error(error.response.data.message);
                setLoading(false);
            });
    }

    const getTeacher = () => {
        setLoadingTeacher(true);
        const token = getCookie("token");
        axios
            .get(`${process.env.REACT_APP_API_URL}/user/teacher`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setLoadingTeacher(false);
                setTeachers(res.data.data);
            });
    }

    useEffect(() => {
        getTeacher();
    }, [])

    useEffect(() => {
        console.log(subject);
        form.setFieldsValue({
            name: subject.name || '',
            idLecture: subject.lecture ? subject.lecture.code : null,
            studentIds: subject.studentIds
        })
    }, [subject])

    const [fileList, setFileList] = useState([]);

    const handleOnchangeFile = (info) => {
        let list = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        list = list.slice(-1);

        // 2. Read from response and show file link
        list = list.map(file => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });
        setFileList(list);

    }
    const props = {
        onChange: handleOnchangeFile,
        beforeUpload: (file) => {
            return false;
        }
    };

    return (
        <>
            <Drawer
                title={subject._id ? "Update subject" : "Create a new subject"}
                width={500}
                onClose={onClose}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div style={{ textAlign: 'right', }} >
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancel</Button>
                        <Button key="submit" form="subjectForm" htmlType="submit" type="primary" loading={loading}>
                            Submit</Button>
                    </div>
                }
            >
                <Form
                    form={form}
                    id="subjectForm"
                    {...layout}
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        // name={["subject", "name"]}
                        name={"name"}
                        label="Name"
                        rules={[
                            {
                                required: true
                            }
                        ]}>

                        < Input />

                    </Form.Item>
                    <Form.Item
                        // name={["subject", "idLecture"]}
                        name={"idLecture"}
                        label="Lecture"
                        rules={[
                            {
                                required: true,
                            }
                        ]}>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a person"
                            optionFilterProp="children"
                            loading={loadingTeacher}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {teachers.map(value => {
                                let name = `${value.surName} ${value.firstName}`;
                                return <Option key={value._id} value={value.code}>{name}</Option>
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        // name={["subject", "name"]}
                        name={"data"}
                        label="Data"
                    >

                        <Upload {...props} accept="application/json" fileList={fileList}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>

                    </Form.Item>

                    <Form.Item
                        label="Student code"
                    >
                        <Form.List
                            // name={["subject", "studentIds"]}
                            name={"studentIds"}
                        >
                            {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Form.Item
                                            required={false}
                                            key={field.key}
                                        >
                                            <Form.Item
                                                {...field}
                                                validateTrigger={['onChange', 'onBlur']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: "Please input code of student or delete this field.",
                                                    },
                                                ]}
                                                noStyle
                                            >
                                                <Input placeholder="Code of student" style={{ width: '60%' }} />
                                            </Form.Item>
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => remove(field.name)}
                                            />
                                        </Form.Item>
                                    ))}
                                    <Form.Item>
                                        <Button
                                            loading={loading}
                                            type="dashed"
                                            onClick={() => add()}
                                            style={{ width: '60%' }}
                                            icon={<PlusOutlined />}
                                        >Add new student</Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};


export default SubjectDrawer;
