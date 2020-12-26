import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input } from 'antd';

import UserForm from './UserForm.jsx';
const ModalPopup = ({ load, setLoad, idUser, visible, setVisible }) => {
    const [accountDetail, setAccountDetail] = useState({
        surName: "",
        emailAddress: "",
        firstName: "",
        idPrivilege: "",
        code: "",
    });
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        setVisible(false);
    };

    const { emailAddress, surName, firstName, idPrivilege, code } = accountDetail;

    return (

        <Modal
            destroyOnClose={true}
            visible={visible}
            title={idUser ? "Update User" : "Add New User"}
            closable={false}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Return
                </Button>,
                <Button key="submit" form="myForm" htmlType="submit" type="primary" loading={loading} >
                    Submit
                </Button>,
            ]}
        >
            <UserForm setLoading={setLoading} load={load} setLoad={setLoad}
                setVisible={setVisible} />
        </Modal>
    );
};

export default ModalPopup;
