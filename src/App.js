import React, { Component, createRef } from "react";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

//Components
import AddProduct from "./Components/AddProduct";
import Cart from "./Components/Cart";
import Login from "./Components/Login";
import ProductList from "./Components/ProductList";

//Context
import Context from "./Context/Context";

//CSS
import "bulma/css/bulma.css";
import "./Style.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cart: {},
      products: [],
    };
    this.routerRef = createRef();
  }

  async componentDidMount() {
    let user = localStorage.getItem("user");
    let cart = localStorage.getItem("cart");

    const products = await axios.get("http://localhost:3001/products");
    user = user ? JSON.parse(user) : null;
    cart = cart ? JSON.parse(cart) : {};

    this.setState({ user, products: products.data });
  }

  login = async (email, password) => {
    const res = await axios
      .post("http://localhost:3001/login", {
        email,
        password,
      })
      .catch((res) => {
        return { status: 401, message: "Unauthorized" };
      });

    if (res.status === 200) {
      const { email } = jwt_decode(res.data.accessToken);
      const user = {
        email,
        token: res.data.accessToken,
        accessLevel: email === "admin@example.com" ? 0 : 1,
      };
      this.setState({
        user,
      });
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } else {
      return false;
    }
  };

  logout = (e) => {
    e.preventDefault();
    this.setState({ user: null });
    localStorage.removeItem("user");
  };

  addProduct = (product, callBack) => {
    let products = this.state.products.slice();
    products.push(product);
    this.setState({ products }, () => callBack && callBack());
  };

  addToCart = (cartItem) => {
    let cart = this.state.cart;

    if (cart[cartItem.id]) {
      cart[cartItem.id].amount += cartItem.amount;
    } else {
      cart[cartItem.id] = cartItem;
    }

    if (cart[cartItem.id].amount > cart[cartItem.id].product.stock) {
      cart[cartItem.id].amount = cart[cartItem.id].product.stock;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({
      cart,
    });
  };

  removeFromCart = (cartItemId) => {
    let cart = this.state.cart;

    delete cart[cartItemId];

    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  clearCart = () => {
    let cart = {};
    localStorage.removeItem("cart");
    this.setState({
      cart,
    });
  };

  checkout = () => {
    if (!this.state.user) {
      this.routerRef.current.history.push("/login");
      return;
    }

    const cart = this.state.cart;

    const products = this.state.products.map((p) => {
      if (cart[p.name]) {
        p.stock = p.stock - cart[p.name].amount;

        axios.put(`http://localhost:3001/products/${p.id}`, { ...p });
      }
      return p;
    });

    this.setState({ products });
    this.clearCart();
  };

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          removeFromCart: this.removeFromCart,
          addToCart: this.addToCart,
          login: this.login,
          addProduct: this.addProduct,
          clearCart: this.clearCart,
          checkout: this.checkout,
        }}
      >
        <BrowserRouter ref={this.routerRef}>
          <div className="App">
            <nav
              className="navbar container"
              role="navigation"
              aria-label="main navigation"
            >
              <div className="navbar-brand">
                <b className="navbar-item is-size-4">فروشگاه اینترنتی</b>
                <label
                  role="button"
                  className="navbar-burger burger"
                  aria-label="menu"
                  aria-expanded="false"
                  data-target="navbarBasicExample"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({
                      showMenu: !this.state.showMenu,
                    });
                  }}
                >
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </label>
              </div>
              <div
                className={`navbar-menu ${
                  this.state.showMenu ? "is-active" : ""
                }`}
              >
                <Link to="/products" className="navbar-item">
                  محصولات
                </Link>
                {this.state.user && this.state.user.accessLevel < 1 && (
                  <Link to="/add-product" className="navbar-item">
                    اضافه کردن محصول
                  </Link>
                )}
                <Link to="/cart" className="navbar-item">
                  سبد خرید
                  <span className="tag is-primary">
                    {Object.keys(this.state.cart).length}
                  </span>
                </Link>
                {!this.state.user ? (
                  <Link to="/login" className="navbar-item">
                    ورود
                  </Link>
                ) : (
                  <Link to="/" onClick={this.logout} className="navbar-item">
                    خروج
                  </Link>
                )}
              </div>
            </nav>

            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/cart" component={Cart} />
              <Route path="/add-product" component={AddProduct} />
              <Route path="/products" component={ProductList} />
              <Route exact path="/" component={ProductList} />
            </Switch>
          </div>
        </BrowserRouter>
      </Context.Provider>
    );
  }
}

export default App;
