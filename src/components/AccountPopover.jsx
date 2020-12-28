import React, { useEffect, useState } from "react";
import { Avatar } from "@fluentui/react-northstar";
import { signOut, getCookie, isAuth } from "../controllers/localStorage.js";
import { toast } from "react-toastify";
import axios from "axios";
import 'antd/dist/antd.css';
import { Popover } from 'antd';
import '../assets/css/Popover.css';
const AccountInfo = ({ history }) => {
  const [accountDetail, setAccountDetail] = useState({
    urlAvatar: "",
    name: "",
    email: ""
  });

  useEffect(() => {
    getAvatar();
    // eslint-disable-next-line
  }, []);

  const getAvatar = () => {
    const token = getCookie("token");
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/info`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        const { emailAddress, firstName, surName, urlAvatar } = res.data;
        console.log(urlAvatar);
        setAccountDetail({ ...accountDetail, urlAvatar: urlAvatar, email: emailAddress, name: `${surName} ${firstName}` });
      })
      .catch((err) => {
        toast.error(`abc ${err.response.statusText}`);
      });
  };
  const { urlAvatar, email, name } = accountDetail;

  const title = (
    <div className='account_info'>
      <div className='account_avatar'>
        <Avatar image={urlAvatar} />
      </div>
      <div className='account_name'>{name}</div>
      <div className='account_email'>{email}</div>
    </div>
  );

  const content = (
    <div>
      {/* <a className='menu_item setting'>Account settings</a> */}
      <a className='menu_item sign_out'
        onClick={() => {
          signOut(() => {
            toast.error("Signout Successfully");
            history.push("/login");
          });
        }}>Sign out</a>
    </div>
  );


  return (
    <Popover placement="bottomRight" title={title} content={content} trigger="click">
      <button className='btn-account-info'
        style={{ marginRight: 50 }}
      >
        <Avatar image={urlAvatar} />
      </button>
    </Popover>
  );
};

export default AccountInfo;
