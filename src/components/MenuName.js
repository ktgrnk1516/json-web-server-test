import React from "react";
import data from "../data.json";

const MenuName = (serviceId) => {
  const menu = data.filter((d) => d.serviceId === serviceId);
  console.log(menu);
  const menuName = menu.name;

  return (
    <div>
      <p>{menuName}</p>
    </div>
  );
};

export default MenuName;
