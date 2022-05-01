import React from "react";
import data from "../data.json";
import MenuName from "./MenuName";

const OrderLists = ({ users, billings }) => {
  //menu名の抽出

  return (
    <div>
      <h1>注文情報一覧</h1>
      <h2>※氏名/サービスid/請求書ステータス</h2>
      <div className="z_wrapper">
        <div className="a_wrapper">
          {users.map((user) => (
            <li className="b_wrapper" key={user.id}>
              <p> {user.name}様</p>
              <p> {user.serviceId}</p>
              <p> {user.status}</p>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderLists;
