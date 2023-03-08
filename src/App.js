import { useCallback, useState, useEffect, useRef, useContext } from 'react';

import Modal from './components/UI/Modal.js';
import Header from './components/Layout/Header.js';
import BMI from './components/Layout/BMI.js';
import ThreeLineChart from './components/UI/ThreeLineChart.js';
import AuthContext from './store/auth-context.js';
import LoadingSpinner from './components/UI/LoadingSpinner';

const App = (props) => {
  const authCtx = useContext(AuthContext);
  const [messages, setMessages] = useState(null);
  const [weightData, setWeightData] = useState({
    c: 0,
    cH: 0,
    cL: 0,
    m: 0,
    mH: 0,
    mL: 0,
    j: 0,
    jH: 0,
    jL: 0,
  });
  const [cIsValid, setCIsValid] = useState(false);
  const [mIsValid, setMIsValid] = useState(false);
  const [jIsValid, setJIsValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const passwordInputRef = useRef();
  const [modalInputId, setModalInputId] = useState('');
  const [isCAuth, setIsCAuth] = useState(false);
  const [isMAuth, setIsMAuth] = useState(false);
  const [isJAuth, setIsJAuth] = useState(false);
  const [isCNewRecord, setIsCNewRecord] = useState(false);
  const [isMNewRecord, setIsMNewRecord] = useState(false);
  const [isJNewRecord, setIsJNewRecord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWholeChart, setShowWholeChart] = useState(false);
  const [halfMonthData, setHalfMonthData] = useState([
    { name: 'C', data: [] },
    { name: 'M', data: [] },
    { name: 'J', data: [] },
  ]);

  const [data, setData] = useState([
    { name: 'C', data: [] },
    { name: 'M', data: [] },
    { name: 'J', data: [] },
  ]);

  const onWeightChangeHandler = (event) => {
    const { name, value } = event.target;
    setWeightData((prev) => ({ ...prev, [name]: value }));
  };

  const myFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const c = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/c`);
      const cData = await c.json();
      const m = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/m`);
      const mData = await m.json();
      const j = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/j`);
      const jData = await j.json();
      const cH = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/c/h`);
      const cHData = await cH.json();
      const cL = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/c/l`);
      const cLData = await cL.json();
      const mH = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/m/h`);
      const mHData = await mH.json();
      const mL = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/m/l`);
      const mLData = await mL.json();
      const jH = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/j/h`);
      const jHData = await jH.json();
      const jL = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/j/l`);
      const jLData = await jL.json();
      if (
        !c.ok ||
        !m.ok ||
        !j.ok ||
        !cH.ok ||
        !cL.ok ||
        !mH.ok ||
        !mL.ok ||
        !jH.ok ||
        !jL.ok
      ) {
        throw new Error(
          cData.message ||
            mData.message ||
            jData.message ||
            cHData.message ||
            cLData.message ||
            mHData.message ||
            mLData.message ||
            jHData.message ||
            jLData.message
        );
      }

      setData([cData, mData, jData]);
      let firstDay = new Date();
      firstDay.setDate(firstDay.getDate() - 15);
      // const strFirstDay = firstDay.toLocaleDateString('en-CA');
      const year = firstDay.toLocaleString('default', { year: 'numeric' });
      const month = firstDay.toLocaleString('default', { month: '2-digit' });
      const day = firstDay.toLocaleString('default', { day: '2-digit' });

      // Generate yyyy-mm-dd date string
      const strFirstDay = year + '-' + month + '-' + day;
      setHalfMonthData([
        {
          ...cData,
          data: cData.data.filter((item) => item.date > strFirstDay),
        },
        {
          ...mData,
          data: mData.data.filter((item) => item.date > strFirstDay),
        },
        {
          ...jData,
          data: jData.data.filter((item) => item.date > strFirstDay),
        },
      ]);

      setWeightData({
        c: cData.data[cData.data.length - 1].value,
        cH: cHData.data,
        cL: cLData.data,
        m: mData.data[mData.data.length - 1].value,
        mH: mHData.data,
        mL: mLData.data,
        j: jData.data[jData.data.length - 1].value,
        jH: jHData.data,
        jL: jLData.data,
      });

      const today = new Date().toLocaleDateString('en-CA');
      if (cData.data[cData.data.length - 1].date !== today) {
        setCIsValid(true);
      }
      if (mData.data[mData.data.length - 1].date !== today) {
        setMIsValid(true);
      }
      if (jData.data[jData.data.length - 1].date !== today) {
        setJIsValid(true);
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

  const checkNewRecordHandler = () => {
    setIsCNewRecord(false);
    setIsMNewRecord(false);
    setIsJNewRecord(false);
    if (
      +weightData.c !== 0 &&
      (+weightData.c === weightData.cH || +weightData.c === weightData.cL)
    ) {
      setIsCNewRecord(true);
    }
    if (
      +weightData.m !== 0 &&
      (+weightData.m === weightData.mH || +weightData.m === weightData.mL)
    ) {
      setIsMNewRecord(true);
    }
    if (
      +weightData.j !== 0 &&
      (+weightData.j === weightData.jH || +weightData.j === weightData.jL)
    ) {
      setIsJNewRecord(true);
    }
  };
  useEffect(checkNewRecordHandler, [checkNewRecordHandler]);

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
      if (resData.username === 'c') {
        setIsCAuth(true);
      }
      if (resData.username === 'm') {
        setIsMAuth(true);
      }
      if (resData.username === 'j') {
        setIsJAuth(true);
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

  const onSetCIsValidHandler = () => {
    setCIsValid(false);
    myFetch();
  };

  const onSetMIsValidHandler = () => {
    setMIsValid(false);
    myFetch();
  };

  const onSetJIsValidHandler = () => {
    setJIsValid(false);
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

  console.log(halfMonthData);

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
          cIsValid={cIsValid}
          mIsValid={mIsValid}
          jIsValid={jIsValid}
          onWeightChange={onWeightChangeHandler}
          onShowModal={showModalHandler}
          weightData={weightData}
          onSetModalInputId={onSetModalInputIdHandler}
          isCAuth={isCAuth}
          isMAuth={isMAuth}
          isJAuth={isJAuth}
          onSetCIsValid={onSetCIsValidHandler}
          onSetMIsValid={onSetMIsValidHandler}
          onSetJIsValid={onSetJIsValidHandler}
          isCNewRecord={isCNewRecord}
          isMNewRecord={isMNewRecord}
          isJNewRecord={isJNewRecord}
          onCheckNewRecord={checkNewRecordHandler}
        />
      )}
      {!isLoading && (
        <button type='button' className={'btn'} onClick={onChartToggleHandler}>
          {showWholeChart ? 'Show Recent 15 Days' : 'Show All'}
        </button>
      )}
      {!isLoading && showWholeChart && <ThreeLineChart data={data} />}
      {!isLoading && !showWholeChart && <ThreeLineChart data={halfMonthData} />}
    </div>
  );
};

export default App;
