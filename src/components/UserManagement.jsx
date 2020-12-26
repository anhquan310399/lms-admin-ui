import React, { useEffect, useState } from "react";
import { getCookie, isAuth } from "../controllers/localStorage.js";
import axios from "axios";
import { Popup, Text, Button } from "@fluentui/react-northstar";
import { toast } from "react-toastify";
import { Table, Space } from 'antd';
import UserModal from '../components/UserModal.jsx';
import { UserAddOutlined } from '@ant-design/icons';

const List = ({ history }) => {
  // const [listTeachers, setListTeachers] = useState([]);
  const [load, setLoad] = useState(false);

  const [visible, setVisible] = useState(false);

  const [state, setState] = useState({
    data: [],
    pagination: {
      current: 1,
      pageSize: 3,
    },
    loading: false,
  });

  useEffect(() => {
    getAll();
  }, [load]);

  const deleteUser = (userId) => {
    const token = getCookie("token");
    if (userId === isAuth()._id) {
      toast.error("you can not delete you");
      return;
    }
    axios
      .delete(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setLoad(!load);
        console.log(res.status);
      });
  };
  const getAll = () => {
    const token = getCookie("token");
    setState({ ...state, loading: true });
    axios
      .get(`${process.env.REACT_APP_API_URL}/user`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        const data = [];
        const arr = res.data;
        arr.forEach((element) => {
          const { _id, code, emailAddress, surName, firstName, urlAvatar } = element;
          data.push({ key: data.length, _id, code, emailAddress, surName, firstName });
        });
        // setListTeachers(data);
        setState({ ...state, data: data, loading: false });
      });
  };

  const handleTableChange = (pagination) => {
    setState({ ...state, pagination: pagination });
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
            content="Edit"
            secondary
            onClick={() => {
              history.push(`/profile/${record._id}`, {
                userId: record._id,
              });
            }}
          />
          <Popup
            content={
              <div>
                <Text content={`Do you want delete user with code: ${record.code} ?`} />
                <Button
                  content="Delete"
                  style={{
                    width: 50,
                    height: 30,
                    backgroundColor: "red",
                    borderRadius: 10,
                    marginLeft: 16,
                    color: 'white'
                  }}
                  onClick={async () => {
                    deleteUser(record._id);
                    setLoad(!load);
                  }}
                />
              </div>
            }
            trigger={
              <Button
                content="Delete"
                secondary
              />
            }
          />
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setVisible(true);
  };

  return (
    <>
      <Button style={{ marginBottom: 8 }} primary onClick={showModal} >
        <UserAddOutlined style={{ marginRight: 8 }} /> Add user
        </Button>
      <UserModal load={load} setLoad={setLoad} visible={visible} setVisible={setVisible} />

      <Table columns={columns} dataSource={data}
        pagination={pagination} loading={loading}
        onChange={handleTableChange} />
    </>
  );
};

export default List;
