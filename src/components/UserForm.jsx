import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { getCookie } from "../controllers/localStorage.js";
import axios from "axios";
import { Form, Input, Select } from "antd";
import { toast } from "react-toastify";
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
    types: {
        email: "${label} is not a valid email!",
    }
};

const UserForm = ({ setLoading, setVisible, load, setLoad }) => {
    const onFinish = (values) => {
        console.log(values);
        setLoading(true);
        const token = getCookie("token");
        axios
            .post(`${process.env.REACT_APP_API_URL}/user/`, {
                code: values.user.code,
                firstName: values.user.firstName,
                surName: values.user.surName,
                emailAddress: values.user.emailAddress,
                idPrivilege: values.user.idPrivilege
            }, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                    toast.success('Create new user success');
                    setLoad(!load);
                    setLoading(false);
                    setVisible(false);
            }).catch(error=>{
                toast.error(error.response.data.message);
                setLoading(false);
            });
    };

    const [state, setState] = useState({
        loadingPrivilege: true,
        privilege: [],
    })

    const getPrivilege = () => {
        const token = getCookie("token");
        axios
            .get(`${process.env.REACT_APP_API_URL}/privilege/`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                setState({ ...state, privilege: res.data, loadingPrivilege: false });
            });
    }

    useEffect(() => {
        getPrivilege();
    }, [])

    const { loadingPrivilege, privilege } = state;


    return (
        <Form
            id="myForm"
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}>
            <Form.Item
                name={["user", "code"]}
                label="Code"
                rules={[
                    {
                        required: true
                    }
                ]}>
                <Input />
            </Form.Item>
            <Form.Item
                name={["user", "idPrivilege"]}
                label="Privilege"
                rules={[
                    {
                        required: true
                    }
                ]}>
                <Select loading={loadingPrivilege}
                >
                    {privilege.map(value => {
                        return (
                            <Option key={value._id} value={value.role}>{value.name}</Option>
                        )
                    })}
                </Select>
            </Form.Item>
            <Form.Item
                name={["user", "emailAddress"]}
                label="Email"
                rules={[
                    {
                        required: true,
                        type: "email"
                    }
                ]}>
                <Input />
            </Form.Item>
            <Form.Item
                name={["user", "surName"]}
                label="Surname"
                rules={[
                    {
                        required: true
                    }
                ]}>
                <Input />
            </Form.Item>
            <Form.Item
                name={["user", "firstName"]}
                label="First name"
                rules={[
                    {
                        required: true
                    }
                ]}>
                <Input />
            </Form.Item>
        </Form>
    );
};

export default UserForm;
