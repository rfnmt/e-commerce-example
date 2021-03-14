import React from "react";

import WithContext from "../Context/WithContext";
import CartItem from "./CartItem";
import withContext from "../Context/WithContext";

const Cart = (props) => {
  const { cart } = props.context;
  const cartKeys = Object.keys(cart || {});

  return (
    <>
      <div className="hero is-primary">
        <div className="hero-body container">
          <h4 className="title">سبد خرید</h4>
        </div>
      </div>
      <br />
      <div className="container">
        {cartKeys.length ? (
          <div className="column columns is-multiline">
            {cartKeys.map((key) => (
              <CartItem
                cartKey={key}
                key={key}
                cartItem={cart[key]}
                removeFromCart={props.context.removeFromCart}
              />
            ))}
            <div className="column is-12 is-clearfix">
              <br />
              <div className="is-pulled-right">
                <button
                  onClick={props.context.clearCart}
                  className="button is-warning "
                >
                  پاکسازی سبد
                </button>{" "}
                <button
                  className="button is-success"
                  onClick={props.context.checkout}
                >
                  ثبت و ادامه
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <div className="title has-text-grey-light">
                سبد خرید شما خالی است!
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default withContext(Cart);
