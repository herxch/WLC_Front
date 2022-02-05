import { Fragment, useRef, useContext } from 'react';
import Input from '../UI/Input';
import BMIChart from '../UI/BMIChart';
import AuthContext from '../../store/auth-context';
import newR from '../../img/new.png';

import classes from './BMI.module.css';

const BMI = (props) => {
  const authCtx = useContext(AuthContext);

  const meInputRef = useRef();
  const xInputRef = useRef();
  const { token } = authCtx;

  const heightData = {
    me: 1.7,
    x: 1.75,
  };

  const onClickHandler = (e) => {
    const { name } = e.target;
    if (
      (name === 'me' && !props.isMeAuth) ||
      (name === 'x' && !props.isXAuth)
    ) {
      props.onSetModalInputId(name);
      props.onShowModal();
      return;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { id } = e.target;
    if ((id === 'me' && !props.isMeAuth) || (id === 'x' && !props.isXAuth)) {
      props.onShowModal();
      return;
    }
    if (id === 'me') {
      const enteredWeight = +meInputRef.current.value;
      try {
        if (enteredWeight < 55 || enteredWeight > 90) {
          return;
        }
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/me`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            date: new Date().toLocaleDateString('en-CA'),
            me: enteredWeight,
          }),
        });
        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.message);
        }
        props.onSetMeIsValid();
      } catch (err) {
        return;
        // setMessages(err.message);
      }
    }
    if (id === 'x') {
      const enteredWeight = xInputRef.current.value;
      try {
        if (enteredWeight < 55 || enteredWeight > 90) {
          return;
        }
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/x`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            date: new Date().toLocaleDateString('en-CA'),
            x: enteredWeight,
          }),
        });
        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.message);
        }
        props.onSetXIsValid();
      } catch (err) {
        // setMessages(err.message);
      }
    }
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

  const meBMIPct = calcBMIPct(props.weightData.me, heightData.me);
  const xBMIPct = calcBMIPct(props.weightData.x, heightData.x);

  const weightDiff =
    Math.round((props.weightData.x - props.weightData.me) * 2.20462 * 10) / 10;

  return (
    <Fragment>
      <div className={classes['BMI-container']}>
        <div className={classes['BMI-me-container']}>
          <div className={classes['BMI-inner']}>
            <div className={classes.HLbar}>
              <span>{props.weightData.meH}</span>
              <span>{props.weightData.meL}</span>
            </div>
            <Input
              id='me'
              label='C'
              value={props.weightData.me}
              IsValid={props.meIsValid}
              IsAuth={props.isMeAuth}
              onSubmit={submitHandler}
              onChange={props.onWeightChange}
              onClick={onClickHandler}
              InputRef={meInputRef}
            />
            <img
              src={newR}
              alt='new record'
              className={props.isMeNewRecord ? classes.show : classes.hide}
            />
          </div>
          <BMIChart id='meChart' BMIPct={meBMIPct} />
        </div>
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
          <div
            className={classes.weightdiff}
          >{`Weight Diff:  ${weightDiff} lbs`}</div>
        </div>
        <div className={classes['BMI-x-container']}>
          <div className={classes['BMI-inner']}>
            <div className={classes.HLbar}>
              <span>{props.weightData.xH}</span>
              <span>{props.weightData.xL}</span>
            </div>
            <Input
              id='x'
              label='X'
              value={props.weightData.x}
              IsValid={props.xIsValid}
              IsAuth={props.isXAuth}
              onSubmit={submitHandler}
              onChange={props.onWeightChange}
              onClick={onClickHandler}
              InputRef={xInputRef}
            />
            <img
              src={newR}
              alt='new record'
              className={props.isXNewRecord ? classes.show : classes.hide}
            />
          </div>
          <BMIChart id='xChart' BMIPct={xBMIPct} />
        </div>
      </div>
    </Fragment>
  );
};

export default BMI;
