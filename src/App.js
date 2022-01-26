import { useCallback, useState, useEffect, useRef, useContext } from 'react';

import Modal from './components/UI/Modal.js';
import Header from './components/Layout/Header.js';
import BMI from './components/Layout/BMI.js';
import TwoLineChart from './components/UI/TwoLineChart.js';
import AuthContext from './store/auth-context.js';

const App = (props) => {
  const authCtx = useContext(AuthContext);
  const [messages, setMessages] = useState(null);
  const [weightData, setWeightData] = useState({ me: 0, x: 0 });
  const [meIsValid, setMeIsValid] = useState(false);
  const [xIsValid, setXIsValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const passwordInputRef = useRef();
  const [modalInputId, setModalInputId] = useState('');
  const [isMeAuth, setIsMeAuth] = useState(false);
  const [isXAuth, setIsXAuth] = useState(false);

  const [data, setData] = useState([
    { name: 'Me', data: [] },
    { name: 'X', data: [] },
  ]);

  const onWeightChangeHandler = (event) => {
    const { name, value } = event.target;
    setWeightData((prev) => ({ ...prev, [name]: value }));
  };

  const myFetch = useCallback(async () => {
    // setIsLoading(true);
    // if (props.type === 'signup') {
    //   setIsLogin(false);
    // }
    // if (props.type === 'login') setIsLogin(true);
    try {
      const me = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/me`);
      const meData = await me.json();
      const x = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/x`);
      const xData = await x.json();
      if (!me.ok || !x.ok) {
        throw new Error(meData.message || xData.message);
      }

      setData([meData, xData]);
      setWeightData({
        me: meData.data[meData.data.length - 1].me,
        x: xData.data[xData.data.length - 1].x,
      });
      const today = new Date().toLocaleDateString('en-CA');

      if (meData.data[meData.data.length - 1].date !== today) {
        setMeIsValid(true);
      }
      if (xData.data[xData.data.length - 1].date !== today) {
        setXIsValid(true);
      }
      // setIsLoading(false);
    } catch (err) {
      // setIsLoading(false);
      setMessages(err);
    }
  }, []);

  useEffect(() => {
    myFetch();
  }, [myFetch]);

  const onModalSubmitHandler = async (e) => {
    e.preventDefault();
    const user = passwordInputRef.current.name;
    const enteredPassword = passwordInputRef.current.value;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/pw/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: user,
            password: enteredPassword,
          }),
        }
      );
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message);
      }
      const expirationTime = new Date(
        new Date().getTime() + +resData.expiresIn
      );
      authCtx.login(
        resData.token,
        expirationTime.toISOString(),
        resData.username
      );
      setShowModal(false);
      if (resData.username === 'me') {
        setIsMeAuth(true);
      }
      if (resData.username === 'x') {
        setIsXAuth(true);
      }
    } catch (err) {
      setMessages(err.message);
    } finally {
      passwordInputRef.current.value = '';
    }
  };

  const onSetModalInputIdHandler = (name) => {
    setModalInputId(name);
  };

  const showModalHandler = () => {
    setShowModal(true);
  };

  const onCloseModalHandler = () => {
    setShowModal(false);
    setMessages(null);
  };

  const onPwChangeHandler = () => {
    setMessages(null);
  };

  const onSetMeIsValidHandler = () => {
    setMeIsValid(false);
    myFetch();
  };

  const onSetXIsValidHandler = () => {
    setXIsValid(false);
    myFetch();
  };

  const modalForm = (
    <form onSubmit={onModalSubmitHandler} className={'modal-form'}>
      <label htmlFor='error' className='error'>
        {messages}
      </label>
      <label htmlFor='passowrd'>Please Enter Password</label>
      <input
        type='password'
        id='password'
        ref={passwordInputRef}
        name={modalInputId}
        onChange={onPwChangeHandler}
        autoFocus
      />
      <div className='modal-btn-container'>
        <button type='submit'>Submit</button>
        <button type='button' onClick={onCloseModalHandler}>
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div>
      {showModal && <Modal onClose={onCloseModalHandler}>{modalForm}</Modal>}
      <Header />
      <BMI
        meIsValid={meIsValid}
        xIsValid={xIsValid}
        onWeightChange={onWeightChangeHandler}
        onShowModal={showModalHandler}
        weightData={weightData}
        onSetModalInputId={onSetModalInputIdHandler}
        isMeAuth={isMeAuth}
        isXAuth={isXAuth}
        onSetMeIsValid={onSetMeIsValidHandler}
        onSetXIsValid={onSetXIsValidHandler}
      />
      <TwoLineChart data={data} />
    </div>
  );
};

export default App;
