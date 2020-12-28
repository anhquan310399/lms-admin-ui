import React, { useState } from "react";
// import authSvg from "../assests/login.svg";
import logo from "../assets/img/logo.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { authenticate, isAuth } from "../controllers/localStorage.js";
import { Link, Redirect } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const Login = ({ history }) => {
  const [formData, setFormData] = useState({
    code: "",
    password: "",
    textChange: "Sign In",
    isLoading: false
  });
  const { code, password, textChange, isLoading } = formData;
  const handleChange = (text) => (e) => {
    setFormData({ ...formData, [text]: e.target.value });
  };

  const sendGoogleToken = (tokenId) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/user/auth/google`, {
        token: tokenId,
      })
      .then((res) => {
        console.log(res.data);
    
        if(res.data.user.idPrivilege==='admin'){
          informParent(res);
        }
        else{
          toast.error('PLease sign with account admin!')
        }
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };
  const informParent = (response) => {
    authenticate(response, () => {
      history.push("/home");
      toast.success(`Hey ${response.data.user.firstName}, Welcome back!`);
    });
  };

  const sendFacebookToken = (accessToken) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/user/auth/facebook`, {
        token: accessToken,
      })
      .then((res) => {
        console.log(res.data);
        if(res.data.user.idPrivilege==='admin'){
          informParent(res);
        }
        else{
          toast.error('PLease sign with account admin!')
        }
      })
      .catch((error) => {
        console.log("FACEBOOK SIGNIN ERROR", error.response);
      });
  };
  const responseGoogle = (response) => {
    console.log(response);
    sendGoogleToken(response.tokenId);
  };

  const responseFacebook = (response) => {
    console.log(response);
    sendFacebookToken(response.accessToken);
  };

  const handleSubmit = (e) => {
    console.log(process.env.REACT_APP_API_URL);
    e.preventDefault();
    if (code && password) {
      setFormData({ ...formData, textChange: "Submitting", isLoading: true });
      axios
        .post(`${process.env.REACT_APP_API_URL}/user/authenticate`, {
          code,
          password,
        })
        .then((res) => {
          console.log(res);
          if (res.data.user.idPrivilege === 'admin') {           
            authenticate(res, () => {
              setFormData({
                ...formData,
                code: "",
                password: "",
                textChange: "Submitted",
              });
              history.push("/home");
              toast.success(`Hey ${res.data.user.firstName}, Welcome back!`);
            });
          }else{
            toast.error('PLease sign with account admin!');
            setFormData({
              ...formData,
              code: "",
              password: "",
              textChange: "Sign In",
              isLoading: false
            });
          }
        })
        .catch((err) => {
          setFormData({
            ...formData,
            code: "",
            password: "",
            textChange: "Sign In",
            isLoading: false
          });
          console.log(err.response);
          toast.error(err.response.data.message);
        });
    } else {
      toast.error("Please fill all fields");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Sign In for LMS ADMIN
            </h1>
            <div className="w-full flex-1 mt-8 text-indigo-500">
              <div className="flex flex-col items-center">
                <GoogleLogin
                  clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                    >
                      <div className=" p-2 rounded-full ">
                        <i className="fab fa-google " />
                      </div>
                      <span className="ml-4">Sign In with Google</span>
                    </button>
                  )}
                ></GoogleLogin>
                <FacebookLogin
                  appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`}
                  autoLoad={false}
                  callback={responseFacebook}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
                    >
                      <div className=" p-2 rounded-full ">
                        <i className="fab fa-facebook" />
                      </div>
                      <span className="ml-4">Sign In with Facebook</span>
                    </button>
                  )}
                />
              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign by certificate
                </div>
              </div>
              <form
                className="mx-auto max-w-xs relative "
                onSubmit={handleSubmit}
              >
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Code"
                  onChange={handleChange("code")}
                  value={code}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange("password")}
                  value={password}
                />
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  disabled={isLoading}
                >
                  {isLoading ? <i className="fas fa-sync fa-spin"></i>
                    : <i className="fas fa-sign-in-alt  w-6  -ml-2" />}

                  <span className="ml-3" >{textChange}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"

            style={{ backgroundImage: `url(${logo})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
