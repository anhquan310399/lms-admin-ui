import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  TeamOutlined,
  FolderOpenOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import AccountPopover from '../components/AccountPopover.jsx';
import '../assets/css/Layout.css'
import 'antd/dist/antd.css';
import logo_header from '../assets/img/logo_header.png';
import UserManagement from '../components/UserManagement.jsx';
import SubjectManagement from '../components/SubjectManagement.jsx';
import AccountManagement from '../components/AccountManagement.jsx';

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

          <Menu.Item key="account" icon={<SettingOutlined />}>
            Thông tin cá nhân
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
            <AccountPopover history={history} setTypeTable={setTypeTable} />
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
          {(typeTable === 'student' || typeTable === 'teacher') && <UserManagement history={history} privilege={typeTable} />}
          {(typeTable === 'subject') && <SubjectManagement history={history} />}
          {(typeTable === 'account') && <AccountManagement history={history} />}

        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
