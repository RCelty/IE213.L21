import React, { useContext, useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { navigate } from "@reach/router";
import {
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  List,
} from "reactstrap";
import "./ClientHeader.css";
import $ from "jquery";

import { AuthContext } from "./../../../contexts/client/AuthContext";
import * as AUTH_TYPE from "./../../../reducers/client/authType";
import { CategoryContext } from "./../../../contexts/client/CategoryContext";
import { ProductSessionContext } from "./../../../contexts/client/ProductSessionContext";

export default function ClientHeader() {
  const { authState, dispatch } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const { categories } = useContext(CategoryContext);
  const { productSessions } = useContext(ProductSessionContext)
  const [totalOrder, setTotalOrder] = useState(0);
  useEffect(() => {}, [categories]);
  useEffect(() => {
    var total = 0;
    productSessions.map(item => total = total + item.amount)
    setTotalOrder(total)
  }, [productSessions]);
  useEffect(() => {
    dispatch({
      type: AUTH_TYPE.SET_AUTH,
      payload: null,
    });
  }, []);

  useEffect(() => {}, [authState]);
  const onLogout = (e) => {
    e.preventDefault();

    dispatch({
      type: AUTH_TYPE.LOGOUT,
      payload: null,
    });
  };

  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      setUser({ ...authState.user._doc });
    }
  }, [authState]);

  $("#btn-toggle").click(() => {
    if ($("#my-navs").hasClass("my-responsive")) {
      $("#my-navs").removeClass("my-responsive");
      $("#my-navs").addClass("my-nav-temp");
    } else {
      $("#my-navs").addClass("my-responsive");
      $("#my-navs").removeClass("my-nav-temp");
    }
  });

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  let [keyword, setKeyword] = useState([]);
  const onChange = async (e) => {
    var key = document.getElementById("search").value;
    setKeyword(key);
  };

  //Enter event
  const handleKeyPress = async (target) => {
    if (target.charCode == 13) {
      window.location.href = `/Product?keyword=${keyword}`;
    }
  };

  function removeVietnameseTones(str) {
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
    str = str.replace(/??|??|???|???|??/g, "i");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
    str = str.replace(/???|??|???|???|???/g, "y");
    str = str.replace(/??/g, "d");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
    str = str.replace(/??|??|???|???|??/g, "I");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
    str = str.replace(/???|??|???|???|???/g, "Y");
    str = str.replace(/??/g, "D");
    str = str.replace(/\s/g, "_");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // M???t v??i b??? encode coi c??c d???u m??, d???u ch??? nh?? m???t k?? t??? ri??ng bi???t n??n th??m hai d??ng n??y
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ?? ?? ?? ?? ??  huy???n, s???c, ng??, h???i, n???ng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ?? ?? ??  ??, ??, ??, ??, ??
    // Remove extra spaces
    // B??? c??c kho???ng tr???ng li???n nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // B??? d???u c??u, k?? t??? ?????c bi???t
    // str = str.replace(
    //   /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    //   " "
    // );
    return str;
  }

  return (
    <div className="my-head">
      <Navbar className="container d-flex justify-content-start align-items-start my-header">
        <NavbarBrand>
          <Link to="/">
            <img
              src={`http://localhost:3000/images/layout/logo.png`}
              alt="Logo"
              className="my-logo"
            />
          </Link>
        </NavbarBrand>
        <NavItem className="mr-auto" navbar>
          <div className="d-inline-block my-form">
            <div className="search row my-row">
              <input
                id="search"
                type="text"
                placeholder="B???n t??m g??..."
                className="my-search-text col-10"
                onChange={(e) => onChange(e)}
                onKeyPress={(e) => handleKeyPress(e)}
              />

              <a
                className="btn btn-outline-primary col-2 my-search-button"
                style={{ height: "40px" }}
                href={"/Product?keyword=" + keyword}
              >
                <a href={"/Product?keyword=" + keyword}>
                  <i className="fa fa-search" />
                </a>
              </a>
            </div>
          </div>
        </NavItem>
        <Nav className="my-header-right d-flex justify-content-center align-items-center">
          {!authState.isAuthenticated && (
            <NavItem>
              <Link
                className="ml-5 my-login-header my-active pr-2"
                to="/account/login"
              >
                <strong>????ng nh???p</strong>
              </Link>
            </NavItem>
          )}
          {authState.isAuthenticated && (
            <NavItem id="nameOfUser">
              <div className="ml-5">
                <Link
                  to="/user/Profile"
                  className="my-header-right-item my-header-right-item2 my-active header-user-name"
                >
                  <strong>{user && user.name} </strong>
                </Link>
                <a
                  href="/user/Profile"
                  className="ml-1 mt-5 my-header-right-item my-header-right-item2 my-user-responsive"
                >
                  <img
                    src={`http://localhost:3000/images/user/${
                      user && user.image
                    }`}
                    alt={user && user.image}
                    width="40px"
                    height="40px"
                    style={{
                      borderRadius: "50%",
                      position: "absolute",
                      top: "25px",
                    }}
                  />
                </a>
              </div>
            </NavItem>
          )}
          {authState.isAuthenticated && (
            <NavItem>
              <div>
                <span
                  onClick={toggle}
                  className="ml-5 my-header-right-item my-header-right-item2 my-res-a my-active my-logout-header"
                >
                  <strong>????ng xu???t</strong>
                </span>
                <span
                  onClick={toggle}
                  className="ml-1 mt-5 my-header-right-item my-header-right-item2 my-res-a my-user-responsive my-logout-header"
                >
                  <img
                    src={`http://localhost:3000/images/layout/user-s-logout.png`}
                    alt=""
                    className="ml-1"
                    style={{ width: "40px", top: "25px", position: "absolute" }}
                  />
                </span>
                <Modal isOpen={modal} toggle={toggle}>
                  <ModalHeader toggle={toggle}>Th??ng b??o</ModalHeader>
                  <ModalBody>B???n c?? ch???c mu???n ????ng xu???t.</ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onClick={(toggle, (e) => onLogout(e))}
                    >
                      ????ng xu???t
                    </Button>{" "}
                    <Button color="secondary" onClick={toggle}>
                      H???y
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
            </NavItem>
          )}
          <NavItem>
            <Link
              to="/order"
              className="ml-5 my-header-right-item my-giohang my-lg"
            >
              <i
                className="fa fa-cart-arrow-down"
                aria-hidden="true"
                style={{ marginRight: "7px" }}
              ></i>
              Gi??? h??ng
              <span className="badge badge-danger my-no" id="amountOrder">{productSessions && totalOrder}</span>
            </Link>
            <Link
              to="/order"
              className="ml-2 my-header-right-item my-giohang my-sm my-res-a"
              style={{ marginRight: "15px" }}
            >
              <i
                className="fas fa-cart-arrow-down"
                aria-hidden="true"
                style={{ marginRight: "4px" }}
              ></i>
              <span className="badge badge-danger my-no" id="amountOrder">{productSessions && totalOrder}</span>
            </Link>
          </NavItem>
        </Nav>
      </Navbar>
      <Navbar
        className="md-flex justify-content-center align-items-center Navigation ml-auto mr-auto"
        style={{ paddingTop: "0px" }}
      >
        <List
          className="my-nav d-flex justify-content-center my-nav-temp mb-2"
          id="my-navs"
        >
          <li className="my-active">
            <Link to="/">TRANG CH???</Link>
          </li>
          <li className="my-parent-2">
            <a href="/Product">
              <span>S???N PH???M </span>
            </a>
            <div className="my-dropdow">
              <List>
                {categories.map((item) => {
                  return (
                    <li>
                      <a
                        href={`/Product?categories=${removeVietnameseTones(
                          item.name
                        )}`}
                        className="li2"
                      >
                        {item.name.toUpperCase()}
                      </a>
                    </li>
                  );
                })}
              </List>
            </div>
          </li>
          <li>
            <Link to="/about">GI???I THI???U</Link>
          </li>
          <li>
            <Link to="/contact">LI??N H???</Link>
          </li>
        </List>
        <a
          href="javascript:void(0);"
          style={{ fontSize: "50px" }}
          className="icon"
          id="btn-toggle"
        >
          &#9776;
        </a>
      </Navbar>
    </div>
  );
}
