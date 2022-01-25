import { Fragment } from 'react';

import classes from './Input.module.css';

const Input = (props) => {
  return (
    <Fragment>
      <form onSubmit={props.onSubmit} id={props.id} className={classes.form}>
        <label htmlFor={props.id} className={classes.label}>
          {props.label} (kg)
        </label>
        <input
          type='text'
          name={props.id}
          value={props.value}
          onChange={props.onChange}
          disabled={!props.IsValid}
          onClick={props.onClick}
          ref={props.InputRef}
          className={classes.input}
        />
        <button disabled={!props.IsValid} type='submit' className={classes.btn}>
          Submit
        </button>
      </form>
    </Fragment>
  );
};

export default Input;
