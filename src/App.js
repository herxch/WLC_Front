import { useCallback, useState, useEffect, useRef, useContext } from 'react';

import Modal from './components/UI/Modal.js';
import Header from './components/Layout/Header.js';
import BMI from './components/Layout/BMI.js';
import TwoLineChart from './components/UI/TwoLineChart.js';
import AuthContext from './store/auth-context.js';
import LoadingSpinner from './components/UI/LoadingSpinner';

const App = (props) => {
  const authCtx = useContext(AuthContext);
  const [messages, setMessages] = useState(null);
  const [weightData, setWeightData] = useState({
    me: 0,
    meH: 0,
    meL: 0,
    x: 0,
    xH: 0,
    xL: 0,
  });
  const [meIsValid, setMeIsValid] = useState(false);
  const [xIsValid, setXIsValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const passwordInputRef = useRef();
  const [modalInputId, setModalInputId] = useState('');
  const [isMeAuth, setIsMeAuth] = useState(false);
  const [isXAuth, setIsXAuth] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWholeChart, setShowWholeChart] = useState(false);
  const [halfMonthData, setHalfMonthData] = useState([
    { name: 'C', data: [] },
    { name: 'X', data: [] },
  ]);

  const [data, setData] = useState([
    { name: 'C', data: [] },
    { name: 'X', data: [] },
  ]);

  const onWeightChangeHandler = (event) => {
    const { name, value } = event.target;
    setWeightData((prev) => ({ ...prev, [name]: value }));
  };

  const myFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const me = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/me`);
      const meData = await me.json();
      const x = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/x`);
      const xData = await x.json();
      const meH = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/me/h`);
      const meHData = await meH.json();
      const meL = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/me/l`);
      const meLData = await meL.json();
      const xH = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/x/h`);
      const xHData = await xH.json();
      const xL = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/x/l`);
      const xLData = await xL.json();
      if (!me.ok || !x.ok || !meH.ok || !meL.ok || !xH.ok || !xL.ok) {
        throw new Error(
          meData.message ||
            xData.message ||
            meHData.message ||
            meLData.message ||
            xHData.message ||
            xLData.message
        );
      }

      setData([meData, xData]);
      let firstDay = new Date();
      firstDay.setDate(firstDay.getDate() - 15);
      const strFirstDay = firstDay.toLocaleDateString('en-CA');
      setHalfMonthData([
        {
          ...meData,
          data: meData.data.filter((item) => item.date > strFirstDay),
        },
        {
          ...xData,
          data: xData.data.filter((item) => item.date > strFirstDay),
        },
      ]);
      setWeightData({
        me: meData.data[meData.data.length - 1].me,
        meH: meHData.data,
        meL: meLData.data,
        x: xData.data[xData.data.length - 1].x,
        xH: xHData.data,
        xL: xLData.data,
      });

      const today = new Date().toLocaleDateString('en-CA');
      if (meData.data[meData.data.length - 1].date !== today) {
        setMeIsValid(true);
      }
      if (xData.data[xData.data.length - 1].date !== today) {
        setXIsValid(true);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setMessages(err);
    }
  }, []);

  useEffect(() => {
    myFetch();
  }, [myFetch]);

  useEffect(() => {
    if (
      weightData.me === weightData.meH ||
      weightData.me === weightData.meL ||
      weightData.x === weightData.xH ||
      weightData.x === weightData.xL
    ) {
      setIsNewRecord(true);
    }
  }, [
    weightData.me,
    weightData.meH,
    weightData.meL,
    weightData.x,
    weightData.xH,
    weightData.xL,
  ]);

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

  const onChartToggleHandler = () => {
    setShowWholeChart((prev) => !prev);
  };

  return (
    <div>
      {showModal && <Modal onClose={onCloseModalHandler}>{modalForm}</Modal>}
      <Header />
      {isLoading && (
        <div className={'centered'}>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
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
          isNewRecord={isNewRecord}
        />
      )}
      {!isLoading && (
        <button type='button' className={'btn'} onClick={onChartToggleHandler}>
          {showWholeChart ? 'Show Recent 15 Days' : 'Show All'}
        </button>
      )}
      {!isLoading && showWholeChart && <TwoLineChart data={data} />}
      {!isLoading && !showWholeChart && <TwoLineChart data={halfMonthData} />}
    </div>
  );
};

export default App;
