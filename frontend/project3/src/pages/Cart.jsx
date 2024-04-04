import React, { useContext, useState, useEffect } from "react";
import CartItem from "../components/CartItem";
import useFetch from "../hooks/useFetch";
import AppContext from "../context/AppContext";

const Cart = () => {
  const fetchData = useFetch();
  const appCtx = useContext(AppContext);
  const [cart, setCart] = useState([]);

  const getCart = async () => {
    try {
      const res = await fetchData(
        "/api/cart",
        "POST",
        { user: appCtx.id },
        appCtx.accessToken
      );

      if (res.ok) {
        setCart(res.data);
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  const handleCheckOut = async () => {};

  const handleClearCart = async () => {
    try {
      const res = await fetchData(
        "/api/cart/all",
        "DELETE",
        { user: appCtx.id },
        appCtx.accessToken
      );

      if (res.ok) {
        getCart();
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      appCtx.setErrorMessage(error.message);
      appCtx.setIsError(true);
    }
  };

  // Get cart by user id on mount
  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="mx-auto w-90 px-4 py-4 flex flex-col">
      <h2 className="text-xl font-bold tracking-tight text-indigo-900 mx-auto">
        Your Cart
      </h2>
      <div className="w-full">
        {cart.map((cartItem, idx) => {
          return <CartItem cartItem={cartItem} key={idx} getCart={getCart} />;
        })}
      </div>
      <div className="flex justify-center mt-4">
        <button
          type="button"
          className="w-1/6 rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm mr-2 hover:bg-amber-500"
          onClick={handleClearCart}
        >
          Clear cart
        </button>
        <button
          type="button"
          className="w-1/6 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          onClick={handleCheckOut}
        >
          Check out
        </button>
      </div>
    </div>
  );
};

export default Cart;
