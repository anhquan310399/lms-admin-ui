import React, { useEffect, useState } from "react";
import { getCookie, isAuth } from "../services/localStorage.js";
import axios from "axios";
import { toast } from "react-toastify";
import SubjectDrawer from './SubjectDrawer.jsx';
import { Button } from "@fluentui/react-northstar";
import { Modal, Space, Table } from 'antd';
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const { confirm } = Modal;

const List = ({ history }) => {
  // const [listTeachers, setListTeachers] = useState([]);
  const [load, setLoad] = useState(false);

  const [visible, setVisible] = useState(false);

  const [listSubject, setListSubject] = useState([]);

  const [subject, setSubject] = useState({});

  const [state, setState] = useState({
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

  useEffect(() => {
    getAll();
  }, [load]);

  const lockSubject = (id) => {
    const token = getCookie("token");
    return axios
      .put(`${process.env.REACT_APP_API_URL}/subject/${id}/hide`, {}, {
        headers: {
          Authorization: token,
        },
      })
  };

  const deleteSubject = (id) => {
    const token = getCookie("token");
    return axios
      .delete(`${process.env.REACT_APP_API_URL}/subject/${id}/`, {
        headers: {
          Authorization: token,
        },
      })
  };
  const getAll = () => {
    const token = getCookie("token");
    setState({ ...state, loading: true });
    axios
      .get(`${process.env.REACT_APP_API_URL}/subject/`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        const data = [];
        const arr = res.data.allSubject;
        arr.forEach((element) => {
          const { _id, name, studentCount, lecture, isDeleted, studentIds } = element;
          data.push({ key: data.length, _id, name, studentCount, lecture, isDeleted, studentIds });
        });
        // setListTeachers(data);
        setState({ ...state, loading: false });
        setListSubject(data);
      })
      .catch(err => {
        handleError(err);
      });
  };

  const handleTableChange = (pagination) => {
    setState({ ...state, pagination: pagination });
  }

  const { pagination, loading } = state;


  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Subject name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Lecture',
      dataIndex: 'lecture',
      key: 'lecture',
      render: (text, record) => {
        let name = `${record.lecture.surName} ${record.lecture.firstName}`
        return (
          <a> {name}</a>
        )
      },
    },
    {
      title: 'Student count',
      key: 'studentCount',
      dataIndex: 'studentCount'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button
            content="Edit"
            primary
            onClick={() => {
              setSubject(record);
              showDrawer();
            }}
          >
          </Button>

          <Button
            content={record.isDeleted ? 'Unlock' : 'Lock'}
            primary
            icon={record.isDeleted ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            onClick={() => { showConfirmLockSubject(record) }}
          >
          </Button>

          <Button
            content="Delete"
            primary
            icon={<DeleteOutlined />}
            onClick={() => { showConfirmDeleteSubject(record) }}
          >
          </Button>
        </Space >
      ),
    },
  ];

  const showConfirmLockSubject = (record) => {
    confirm({
      title: `Do you Want to ${record.isDeleted ? 'Unlock' : 'Lock'} this subject : ${record.name}?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // return deleteUser(record._id);
        return new Promise((resolve, reject) => {
          lockSubject(record._id)
            .then((res) => {
              toast.success(res.data.message);
              setLoad(!load);
              console.log(res.status);
              resolve();
            }).catch(err => {
              handleError(err);
              resolve();
            });
        });
      },
    });
  }

  const showConfirmDeleteSubject = (record) => {
    confirm({
      title: `Do you Want to Delete this subject : ${record.name}?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // return deleteUser(record._id);
        return new Promise((resolve, reject) => {
          deleteSubject(record._id)
            .then((res) => {
              toast.success(res.data.message);
              setLoad(!load);
              console.log(res.status);
              resolve();
            }).catch(err => {
              handleError(err);
              resolve();
            });
        });
      },
    });
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

  const showDrawer = () => {
    setVisible(true);
  };

  return (
    <>
      <Button style={{ marginBottom: 8 }} primary onClick={showDrawer}
        content='Add subject'
        icon={<PlusOutlined />}
      >

      </Button>
      <SubjectDrawer setAuthenticate={setAuthenticate} load={load} setLoad={setLoad} visible={visible} setVisible={setVisible} subject={subject} setSubject={setSubject} />

      <Table columns={columns} dataSource={listSubject}
        pagination={pagination} loading={loading}
        onChange={handleTableChange} />
    </>
  );
};

export default List;
