import { Fragment, useRef, useContext } from 'react';
import Input from '../UI/Input';
import BMIChart from '../UI/BMIChart';
import AuthContext from '../../store/auth-context';
import newR from '../../img/new.png';

import classes from './BMI.module.css';

const BMI = (props) => {
  const authCtx = useContext(AuthContext);

  const cInputRef = useRef();
  const mInputRef = useRef();
  const jInputRef = useRef();
  const { token } = authCtx;

  const heightData = {
    c: 1.7,
    m: 1.8,
    j: 1.7,
  };

  const onClickHandler = (e) => {
    const { name } = e.target;
    if (
      (name === 'c' && !props.isCAuth) ||
      (name === 'm' && !props.isMAuth) ||
      (name === 'j' && !props.isJAuth)
    ) {
      props.onSetModalInputId(name);
      props.onShowModal();
      return;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { id } = e.target;
    if (
      (id === 'c' && !props.isCAuth) ||
      (id === 'm' && !props.isMAuth) ||
      (id === 'j' && !props.isJAuth)
    ) {
      props.onShowModal();
      return;
    }
    if (id === 'c') {
      const enteredWeight = +cInputRef.current.value;
      try {
        if (enteredWeight < 55 || enteredWeight > 90) {
          return;
        }
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/c`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            date: new Date().toLocaleDateString('en-CA'),
            value: enteredWeight,
          }),
        });
        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.message);
        }
        props.onSetCIsValid();
      } catch (err) {
        return;
        // setMessages(err.message);
      }
    }
    if (id === 'm') {
      const enteredWeight = mInputRef.current.value;
      try {
        if (enteredWeight < 55 || enteredWeight > 95) {
          return;
        }
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/m`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            date: new Date().toLocaleDateString('en-CA'),
            value: enteredWeight,
          }),
        });
        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.message);
        }
        props.onSetMIsValid();
      } catch (err) {
        // setMessages(err.message);
      }
    }
    if (id === 'j') {
      const enteredWeight = jInputRef.current.value;
      try {
        if (enteredWeight < 50 || enteredWeight > 95) {
          return;
        }
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/j`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            date: new Date().toLocaleDateString('en-CA'),
            value: enteredWeight,
          }),
        });
        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.message);
        }
        props.onSetJIsValid();
      } catch (err) {
        // setMessages(err.message);
      }
    }
    props.onCheckNewRecord();
  };

  const calcBMIPct = (weight, height) => {
    const BMIPct = (weight / height ** 2 - 18.5) / 11.4;
    if (BMIPct <= 0) {
      return 0;
    } else if (BMIPct > 1) {
      return 1;
    } else {
      return BMIPct;
    }
  };

  const cBMIPct = calcBMIPct(props.weightData.c, heightData.c);
  const mBMIPct = calcBMIPct(props.weightData.m, heightData.m);
  const jBMIPct = calcBMIPct(props.weightData.j, heightData.j);

  // const weightDiff =
  //   Math.round((props.weightData.m - props.weightData.c) * 2.20462 * 10) / 10;

  return (
    <Fragment>
      <div className={classes['BMI-container']}>
        <div className={classes.middle}>
          <table>
            <tbody>
              <tr>
                <th>BMI</th>
                <th>Weight Status</th>
              </tr>
              <tr>
                <td>Below 18.5</td>
                <td>Underweight</td>
              </tr>
              <tr>
                <td>18.5—24.9</td>
                <td>Healthy</td>
              </tr>
              <tr>
                <td>25.0—29.9</td>
                <td>Overweight</td>
              </tr>
              <tr>
                <td>30.0 and Above</td>
                <td>Obese</td>
              </tr>
            </tbody>
          </table>
          {/* <div
            className={classes.weightdiff}
          >{`Weight Diff:  ${weightDiff} lbs`}</div> */}
        </div>
        <div className={classes['BMI-c-container']}>
          <div className={classes['BMI-inner']}>
            <div className={classes.HLbar}>
              <span>{props.weightData.cH}</span>
              <span>{props.weightData.cL}</span>
            </div>
            <Input
              id='c'
              label='C'
              value={props.weightData.c}
              IsValid={props.cIsValid}
              IsAuth={props.isCAuth}
              onSubmit={submitHandler}
              onChange={props.onWeightChange}
              onClick={onClickHandler}
              InputRef={cInputRef}
            />
            <img
              src={newR}
              alt='new record'
              className={props.isCNewRecord ? classes.show : classes.hide}
            />
          </div>
          <BMIChart id='cChart' BMIPct={cBMIPct} />
        </div>

        <div className={classes['BMI-m-container']}>
          <div className={classes['BMI-inner']}>
            <div className={classes.HLbar}>
              <span>{props.weightData.mH}</span>
              <span>{props.weightData.mL}</span>
            </div>
            <Input
              id='m'
              label='M'
              value={props.weightData.m}
              IsValid={props.mIsValid}
              IsAuth={props.isMAuth}
              onSubmit={submitHandler}
              onChange={props.onWeightChange}
              onClick={onClickHandler}
              InputRef={mInputRef}
            />
            <img
              src={newR}
              alt='new record'
              className={props.isMNewRecord ? classes.show : classes.hide}
            />
          </div>
          <BMIChart id='mChart' BMIPct={mBMIPct} />
        </div>
        <div className={classes['BMI-j-container']}>
          <div className={classes['BMI-inner']}>
            <div className={classes.HLbar}>
              <span>{props.weightData.jH}</span>
              <span>{props.weightData.jL}</span>
            </div>
            <Input
              id='j'
              label='J'
              value={props.weightData.j}
              IsValid={props.jIsValid}
              IsAuth={props.isJAuth}
              onSubmit={submitHandler}
              onChange={props.onWeightChange}
              onClick={onClickHandler}
              InputRef={jInputRef}
            />
            <img
              src={newR}
              alt='new record'
              className={props.isMNewRecord ? classes.show : classes.hide}
            />
          </div>
          <BMIChart id='jChart' BMIPct={jBMIPct} />
        </div>
      </div>
    </Fragment>
  );
};

export default BMI;
