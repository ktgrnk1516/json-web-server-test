import "./App.css";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import data from "./data.json"; //サービスのメニューのdata
import OrderLists from "./components/OrderLists";
import BillingLists from "./components/BillingLists";

//https://github.com/axios/axios //axiosの使い方
//https://github.com/yourmystar/coding-test-1938139 //テスト概要
//http://technote.work/?p=97 //json-serverを立ててaxiosで呼ぶ

function App() {
  //アプリで使う状態たち
  const [id, setId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [status, setStatus] = useState("");
  const [inputName, setInputName] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(""); //該当の注文情報
  const [users, setUsers] = useState([]); //すべての注文情報
  const [billing, setBilling] = useState({}); //該当の請求情報
  const [billings, setBillings] = useState([]); //すべての請求情報
  // const [time, setTime] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [creatStatus, setCreatStatus] = useState([]);

  //inputやselect要素のonChangeを管理
  const handleChange = (e) => {
    if (e.target.name === "serviceId") {
      setServiceId(() => e.target.value);
    } else if (e.target.name === "id") {
      setId(() => e.target.value);
    } else if (e.target.name === "status") {
      setStatus(() => e.target.value);
    } else if (e.target.name === "inputName") {
      setInputName(() => e.target.value);
    } else if (e.target.name === "name") {
      setName(() => e.target.value);
    }
  };

  /**
   * この関数を実装してください。
   */
  const placeOrder = async (serviceId) => {
    if (!name && !serviceId) {
      alert("未入力・未選択の項目があります");
      return;
    }

    //現在時刻の取得
    // const now = new Date();
    // const Year = now.getFullYear();
    // const Month = now.getMonth() + 1;
    // const Day = now.getDate();
    // const Hour = now.getHours();
    // const Min = now.getMinutes();

    // const time = Year + "年" + Month + "月" + Day + "日" + Hour + ":" + Min;
    // setTime(time);

    //idを自動生成するのではなく、乱数の生成を生成して指定
    let char = "abcdefghijklmnopqrstuvwxyz123456789";
    let random_id = "";
    for (let i = 0; i < 10; i++) {
      random_id += char[Math.floor(Math.random() * 35)];
    }

    //注文書の作成
    try {
      await axios.post("http://localhost:3001/orders/", {
        id: random_id,
        serviceId: serviceId,
        status: "CREATED",
        name: inputName,
      });
    } catch (e) {
      if (e.response && e.response.status === 400) {
        console.log("クライアント側に問題があります");
      } else if (e.response && e.response.status === 500) {
        console.log("API側に不具合があります");
      } else {
        console.log(e.response.status);
      }
    }

    //請求書の作成
    try {
      //メニューの金額を抽出
      const menu = data.filter((d) => d.serviceId === serviceId);
      const amount = Number(menu[0].amount);

      //作成
      // const res =
      await axios
        .post("http://localhost:3001/billings/", {
          name: inputName,
          orderId: random_id,
          amount: amount,
        })
        .then(() => {
          getOrder(random_id) //請求書作成後に、statusの更新をする
            .then(() => {
              const props = {
                serviceId: serviceId,
                name: inputName,
                id: random_id,
                status: "PROCESSED",
              };

              putStatus(props).then(() => setTrigger(!trigger));
            });
        });

      // const json = res.data;
      // console.log(json);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        console.log("クライアント側に問題があります");
      } else if (e.response && e.response.status === 500) {
        console.log("API側に不具合があります");
      } else {
        console.log(e.response);
      }
    }

    // setTrigger(!trigger);
  };

  //②Orderの取得（idを受け取る）
  const getOrder = async (id) => {
    try {
      // const res = await axios.get(`http://localhost:3001/orders/${id}`);

      // const json = res.data;
      // setUser(json);
      // console.log(json);
      await axios.get(`http://localhost:3001/orders/${id}`).then((res) => {
        const json = res.data;
        setUser(json);
        console.log(json);
      });

      // {
      //   "id": "5XGNMiCS56",
      //   "serviceId": "0x3SUBYOax",
      //   "status": "CREATED"
      // }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        console.log("クライアント側に問題があります");
      } else if (e.response && e.response.status === 500) {
        console.log("API側に不具合があります");
      } else {
        console.log(e.message);
      }
    }
  };

  //②'すべてのOrdersの取得（レンダリング時に実行）
  const getAllOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3001/orders/");
      const json = await res.data;
      setUsers(json);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        console.log("クライアント側に問題があります");
      } else if (e.response && e.response.status === 500) {
        console.log("API側に不具合があります");
      } else {
        console.log(e.message);
      }
    }
  };
  //②''すべてのBillingsの取得（レンダリング時に実行）
  const getAllBillings = async () => {
    try {
      const res = await axios.get("http://localhost:3001/billings/");
      const json = await res.data;
      setBillings(json);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        console.log("クライアント側に問題があります");
      } else if (e.response && e.response.status === 500) {
        console.log("API側に不具合があります");
      } else {
        console.log(e.message);
      }
    }
  };

  useEffect(() => {
    getAllOrders();
    getAllBillings();
  }, [trigger]);

  useEffect(() => {
    // orderのstatusがCreatedの人の配列を作成
    const arr1 = users.map((u) => u.id);
    const arr2 = billings.map((b) => b.orderId);
    const arr1arr2 = [...arr1, ...arr2];
    const duplicatedArr = arr1arr2.filter(
      (item) => arr1.includes(item) && arr2.includes(item)
    );
    console.log(new Set(duplicatedArr));

    setCreatStatus(new Set(duplicatedArr));
  }, []);

  //③Billingの取得（Orderのidを受け取る）
  const getBilling = async (id) => {
    //idと一致するorderIdを含むbillingを抽出

    try {
      await axios
        .get(`http://localhost:3001/billings/?orderId=${id}`)
        .then((res) => {
          const json = res.data;
          setBilling(...json);
          console.log(billing);
        });
    } catch (e) {
      if (e.response && e.response.status === 400) {
        console.log("クライアント側に問題があります");
      } else if (e.response && e.response.status === 500) {
        console.log("API側に不具合があります");
      } else {
        console.log(e.message);
      }
    }
  };

  // ④Orderのstatusの更新
  const putStatus = async (props) => {
    console.log(props);

    try {
      const res = await axios.put(`http://localhost:3001/orders/${props.id}`, {
        name: props.name,
        serviceId: props.serviceId,
        id: props.id,
        amount: props.amount,
        status: props.status,
      });
      const json = res.data;
      console.log(json);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        console.log("クライアント側に問題があります");
      } else if (e.response && e.response.status === 500) {
        console.log("API側に不具合があります");
      } else {
        console.log(e.message);
      }
    }
  };

  //④Billingの削除
  const deleteOrder = async (id) => {
    if (!id) {
      return;
    }

    try {
      //まずは請求書の削除
      await getBilling(id);
      const billingId = billing.id;
      console.log(billingId);

      const res = await axios.delete(
        `http://localhost:3001/billings/${billingId}`
      );
      const json = res.data;
      setUser(json);
      console.log(json);
      // {
      //   "id": "5XGNMiCS56",
      //   "serviceId": "0x3SUBYOax",
      //   "status": "CREATED"
      // }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        console.log("クライアント側に問題があります");
      } else if (e.response && e.response.status === 500) {
        console.log("API側に不具合があります");
      } else {
        console.log(e.message);
      }
    }

    //次にorderの削除
    try {
      const res = await axios.delete(`http://localhost:3001/orders/${id}`);
      const json = res.data;
      setUser(json);
      console.log(json);
      // {
      //   "id": "5XGNMiCS56",
      //   "serviceId": "0x3SUBYOax",
      //   "status": "CREATED"
      // }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        console.log("クライアント側に問題があります");
      } else if (e.response && e.response.status === 500) {
        console.log("API側に不具合があります");
      } else {
        console.log(e.message);
      }
    }
    setTrigger(!trigger);
  };

  //④Billingの削除
  const deleteBilling = async (id) => {
    if (!id) {
      return;
    }

    try {
      await axios
        .get(`http://localhost:3001/billings/?orderId=${id}`)
        .then((res) => {
          const json = res.data;
          console.log(json[0]);
          setBilling(json[0]);
          console.log(billing);
        })

        .then(() => {
          const billingId = billing.id;
          //Billingの削除
          axios
            .delete(`http://localhost:3001/billings/${billingId}`)
            .then((res) => {
              const json = res.data;
              setUser(json);
            });
        })
        //status更新
        .then(() => {
          getOrder(id) //請求書作成後に、statusの更新をする
            .then(() => {
              console.log(user);
              const props = {
                //userからひっぱる？
                serviceId: user.serviceId,
                name: user.name,
                id: id,
                status: "CREATED",
              };

              putStatus(props).then(() => setTrigger(!trigger));
            });
        });
    } catch (e) {
      if (e.response && e.response.status === 400) {
        console.log("クライアント側に問題があります");
      } else if (e.response && e.response.status === 500) {
        console.log("API側に不具合があります");
      } else {
        console.log(e.message);
      }
    }

    // setTrigger(!trigger);
  };

  //⑤個別Billingの作成
  const postBilling = async (id) => {
    if (!id) {
      return;
    }

    try {
      await getOrder(id) //user情報に該当情報入る
        .then(() => {
          //ユーザーが買ったserviceIdの値段の取得
          const menu = data.filter((d) => d.serviceId === user.serviceId);
          const amount = Number(menu[0].amount);
          console.log(amount);

          //作成
          // const res =
          axios.post("http://localhost:3001/billings/", {
            name: user.name,
            orderId: id,
            amount: amount,
          });
        })
        .then(() => {
          getOrder(id) //請求書作成後に、statusの更新をする
            .then(() => {
              const props = {
                //userからひっぱる？
                serviceId: user.serviceId,
                name: user.name,
                id: id,
                status: "PROCESSED",
              };
              // console.log(...user);

              putStatus(props).then(() => setTrigger(!trigger));
            });
        });
    } catch (e) {
      if (e.response && e.response.status === 400) {
        console.log("クライアント側に問題があります");
      } else if (e.response && e.response.status === 500) {
        console.log("API側に不具合があります");
      } else {
        console.log(e.response);
      }
    }
    // setTrigger(!trigger);
  };

  return (
    <div className="App">
      <div className="contents_wrapper">
        <h1>サービス管理画面</h1>
        {/* 注文の作成ボタン */}
        <div className="wrapper">
          <p>氏名を記入:</p>
          <input
            placeholder="氏名"
            type="text"
            name="inputName"
            value={inputName}
            onChange={handleChange}
          />

          <p>サービスを選ぶ:</p>
          <select value={serviceId} name="serviceId" onChange={handleChange}>
            <option value="">サービスを選択してください</option>
            <option value={data[0].serviceId}>
              {data[0].name} : {Number(data[0].amount).toLocaleString()}円
            </option>
            <option value={data[1].serviceId}>
              {data[1].name} : {Number(data[1].amount).toLocaleString()}円
            </option>
            <option value={data[2].serviceId}>
              {data[2].name} : {Number(data[2].amount).toLocaleString()}円
            </option>
          </select>

          <button onClick={() => placeOrder(serviceId)}>注文する</button>
        </div>

        <div className="comp_wrapper">
          <div className="c_wrapper">
            <OrderLists users={users} billings={billings} />
          </div>
          <div className="c_wrapper">
            <BillingLists users={users} billings={billings} />
          </div>
        </div>

        {/* 注文キャンセルボタン */}
        <div className="d_wrapper">
          <p>お客様を選ぶ:</p>

          <select name="id" onChange={handleChange}>
            <option value="">お客様を選択してください</option>
            {users.map((user) => (
              <option value={user.id} key={user.id}>
                {user.name} 様
              </option>
            ))}
          </select>
          <button onClick={() => deleteOrder(id)}>注文のキャンセル</button>
        </div>

        {/* 請求書の作成ボタン */}
        <div className="d_wrapper">
          <p>お客様を選ぶ:</p>

          <select name="id" onChange={handleChange}>
            <option value="">お客様を選択してください</option>
            {billings.map((user) => (
              <option value={user.orderId} key={user.id}>
                {user.name} 様
              </option>
            ))}
          </select>
          <button onClick={() => deleteBilling(id)}>請求書の取り消し</button>
        </div>

        {/* 注文情報の取得ボタン */}
        <div className="d_wrapper">
          <p>お客様を選ぶ:</p>

          <select name="id" onChange={handleChange}>
            <option value="">お客様を選択してください</option>
            {users.map((user) => (
              <option value={user.id} key={user.id}>
                {user.name} 様
              </option>
            ))}
          </select>
          <button onClick={() => postBilling(id)}>請求書を作成する</button>
        </div>
      </div>
    </div>
  );
}

export default App;
