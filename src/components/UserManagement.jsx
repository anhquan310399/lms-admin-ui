import React, { useEffect, useState } from "react";
import { getCookie, isAuth } from "../services/localStorage.js";
import axios from "axios";
import { toast } from "react-toastify";
import UserModal from './AddUserModal.jsx';
import { Button } from "@fluentui/react-northstar";
import { Modal, Space, Table } from 'antd';
import {
  ExclamationCircleOutlined,
  UserAddOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';

const { confirm } = Modal;

const List = ({ history, privilege }) => {
  // const [listTeachers, setListTeachers] = useState([]);
  const [load, setLoad] = useState(false);

  const [visible, setVisible] = useState(false);

  const [state, setState] = useState({
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
  });

  const [isAuthenticate, setAuthenticate] = useState(true);
  useEffect(() => {
    if (!isAuthenticate) {
      history.push("/login");
      toast.error("Your token is expired. Please login again");
    }
  }, [isAuthenticate])


  const [user, setUser] = useState({});

  useEffect(() => {
    getAll();
  }, [load, privilege]);

  const deleteUser = (userId) => {
    const token = getCookie("token");
    return axios
      .put(`${process.env.REACT_APP_API_URL}/user/${userId}/hide`, {}, {
        headers: {
          Authorization: token,
        },
      })

  };
  const getAll = () => {
    const token = getCookie("token");
    setState({ ...state, loading: true });
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/${privilege}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        const data = [];
        const arr = res.data.data;
        arr.forEach((element) => {
          const { _id, code, emailAddress, surName, firstName, urlAvatar, isDeleted, idPrivilege } = element;
          data.push({ key: data.length, _id, code, emailAddress, surName, firstName, isDeleted, idPrivilege });
        });
        // setListTeachers(data);
        setState({ ...state, data: data, loading: false });
      })
      .catch(error => {
        handleError(error);
      });
  };

  const handleTableChange = (pagination) => {
    setState({ ...state, pagination: pagination });
  }

  const handleError = (error) => {
    if (error.response.status === 401) {
      history.push("/login");
      toast.error("Your token is expired. Please login again");
    } else {
      console.log(error.response);
      toast.error(error.response.data.message);
    }
  }

  const { data, pagination, loading } = state;


  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Surname',
      dataIndex: 'surName',
      key: 'surName',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Email',
      key: 'emailAddress',
      dataIndex: 'emailAddress'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button
            content={"Detail"}
            primary
            onClick={() => {
              console.log(record);
              setUser(record);
              showModal();
            }}
          >
          </Button>
          <Button
            content={record.isDeleted ? 'Unlock' : 'Lock'}
            primary
            icon={record.isDeleted ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            onClick={() => { showConfirm(record) }}
          >
          </Button>
        </Space >
      ),
    },
  ];

  const showConfirm = (record) => {
    confirm({
      title: `Do you Want to ${record.isDeleted ? 'Unlock' : 'Lock'} this user with code: ${record.code}?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // return deleteUser(record._id);
        return new Promise((resolve, reject) => {
          deleteUser(record._id)
            .then((res) => {
              toast.success(res.data.message);
              setLoad(!load);
              console.log(res.status);
              resolve();
            }).catch(err => {
              resolve();
              handleError(err);
            });
        });
      },
    });
  }

  const showModal = () => {
    setVisible(true);
  };

  return (
    <>
      <Button style={{ marginBottom: 8 }} primary onClick={showModal}
        content='Add user'
        icon={<UserAddOutlined />}
      >

      </Button>
      <UserModal user={user} setUser={setUser} setAuthenticate={setAuthenticate} load={load} setLoad={setLoad} visible={visible} setVisible={setVisible} idPrivilege={privilege} />

      <Table columns={columns} dataSource={data}
        pagination={pagination} loading={loading}
        onChange={handleTableChange} />
    </>
  );
};

export default List;
