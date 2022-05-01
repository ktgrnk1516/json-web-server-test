import React from "react";
import data from "../data.json";

const BillingLists = ({ billings, users }) => {
  return (
    <div>
      <h1>請求書一覧</h1>
      <h2>※氏名/請求id/請求金額</h2>
      <div className="z_wrapper">
        <div className="a_wrapper">
          {billings.map((user) => (
            <li className="b_wrapper" key={user.id}>
              <p> {user.name}様</p>
              <p> {user.id}</p>
              <p> {user.amount.toLocaleString()}円</p>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingLists;
