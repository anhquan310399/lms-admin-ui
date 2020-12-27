import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Layout, Menu, Image } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  TeamOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import AccountInfo from '../components/AccountInfo.jsx';
import '../assets/css/Layout.css'
import 'antd/dist/antd.css';
import logo_header from '../assets/img/logo_header.png';
import UserManagement from '../components/UserManagement';
import SubjectManagement from '../components/SubjectManagement';

const { Header, Sider, Content } = Layout;

function Home({ history }) {

  const [isToggle, setToggle] = useState(false);
  const [typeTable, setTypeTable] = useState('teacher');

  const toggle = () => {
    setToggle(!isToggle);
  };

  const handleClick = (e) => {
    setTypeTable(e.key);
  }



  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={isToggle}>
        <div className="logo" >
          {isToggle ? <span></span> : <h1>Trang quản lý</h1>}

        </div>

        <Menu theme="dark" mode="inline" onClick={handleClick} defaultSelectedKeys={['teacher']}>
          <Menu.Item key="teacher" icon={<UserOutlined />}>
            Quản lý Giảng viên
            </Menu.Item>
          <Menu.Item key="student" icon={<TeamOutlined />}>
            Quản lý Sinh viên
            </Menu.Item>
          <Menu.Item key="subject" icon={<FolderOpenOutlined />}>
            Quản lý Môn học
            </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(isToggle ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: toggle,
          })}
          <div className='layout-account-info' style={{ backgroundImage: `url(${logo_header})` }}>
            <AccountInfo history={history} setTypeTable={setTypeTable} />
          </div>
        </Header>
        <ToastContainer />
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {(typeTable === 'student' || typeTable === 'teacher') ?
            <UserManagement history={history} privilege={typeTable} />
            : <SubjectManagement history={history} />
          }
        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
