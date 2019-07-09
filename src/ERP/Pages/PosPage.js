import React from "react";
import ReactDOM from "react-dom";
import PosItem from "../Components/PosItem.js";
import { withStyles } from "@material-ui/core/styles";
import { API_URL } from "../properties/applicationProperties";
import "../css/pos.css";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import InvoiceItem from "../Components/InvoiceItem";
import Backspace from "../../assets/img/backspace.png";
import PosCustomerPage from "../Pages/PosCustomerPage";
import PosPaymentPage from "./PosPaymentPage.jsx";

const styles = theme => ({
  productColumn: {
    float: "left",
    width: "450px",
    border: "3px",
    height: "200px"
  },
  column: {
    float: "left",
    width: "1300px"
  },

  /* Clear floats after the columns */
  row: {
    content: "",
    display: "table",
    clear: "both",
    width: "1800px"
  },
  productSearch: {
    content: "",
    display: "table",
    clear: "both",
    width: "1350px"
  },
  invoiceProduct: {
    display: "inline-block",
    width: "455px",
    height: "650px",
    overflow: "scroll",
    overflowX: "hidden"
  },
  numberPad: {
    float: "left"
  }
});

class PosPage extends React.Component {
  state = {
    total: 0.0,
    productList: [],
    headers: ["Code", "name", "Price", "Qty"],
    isErrDlgOpen: false,
    numberPadMode: "quantity",
    selectedInvoiceItem: null,
    selectedQuantity: "",
    isNumberPadQuantity: false,
    customerPageClass: "hide",
    paymentPageClass: "hide",
    posPageClass: "show",
    isPOSOpen: true,
    customer: null,
    isCustomerSet: false,
    isPOSPage: true
  };

  handleChange = event => {
    // this.setState({ productCode: event.target.value });
    this.getProduct(event.target.value);
  };
  cancelPos = () => {
    // ReactDOM.render(<MainPage />, document.getElementById("root"));
  };

  closeErrorDialog = () => {
    this.setState({ isErrDlgOpen: false });
  };
  posItemOnclick = (product, quantity) => {
    this.addShoppingCart(product, quantity, false);
  };
  addShoppingCart = (product, quantity, isNumberPadQuantity) => {
    let productCode = product.productCode;

    let invoiceProduct;

    if (this.state.productList[productCode] != null) {
      invoiceProduct = this.state.productList[productCode];
      invoiceProduct.quantity = invoiceProduct.quantity + quantity;
      let total = this.state.total - invoiceProduct.totalForProduct;
      if (isNumberPadQuantity) {
        invoiceProduct.totalForProduct = invoiceProduct.salePrice * quantity;

        total = total + invoiceProduct.totalForProduct;
        this.setState({
          total: total
        });
      } else {
        invoiceProduct.totalForProduct =
          invoiceProduct.totalForProduct + invoiceProduct.salePrice * quantity;
        console.log(
          "invoiceProduct.totalForProduct ",
          invoiceProduct.totalForProduct
        );
        total = total + invoiceProduct.totalForProduct;
        this.setState({
          total: total
        });
      }
    } else {
      invoiceProduct = {
        productName: product.productName,
        salePrice: product.salePrice,
        quantity: 1,
        totalForProduct: product.salePrice,
        productCode: product.productCode
      };
      this.setState({ total: this.state.total + product.salePrice });
    }
    this.state.productList[productCode] = invoiceProduct;
    // this.setState({ isNumberPadQuantity: false });
    // this.state.shoppingCartList.push(invoiceProduct);
    this.setState({ productList: this.state.productList });
  };

  onclickCssClassChange = (event, existingClass, newClass) => {
    const itemList = document.getElementsByClassName(existingClass);
    // itemList.map((n, index) => {
    //   n.className = newClass;
    // });
    for (var i = 0; i < itemList.length; i++) {
      itemList[i].className = existingClass;
    }
    event.currentTarget.className = newClass;
  };

  invoiceItemOnclick = (event, data) => {
    this.setState({ selectedInvoiceItem: data });
    this.onclickCssClassChange(event, "orderline", "orderline selected");
    this.setState({ selectedQuantity: "" });
    this.setState({ isNumberPadQuantity: true });
  };
  numberPadClick = event => {
    let mode = this.state.numberPadMode;
    let selectedInvoiceItem = this.state.selectedInvoiceItem;
    let newValue;
    switch (mode) {
      case "quantity":
        newValue = this.state.selectedQuantity + event.currentTarget.value;
        console.log("New Value", newValue);
        selectedInvoiceItem.quantity = 0;
        this.setState({ selectedQuantity: newValue });
        this.addShoppingCart(selectedInvoiceItem, parseInt(newValue), true);
        console.log("selected Item", selectedInvoiceItem);
        break;
      case "discount":
        // text = "I am not a fan of orange.";
        break;
      case "price":
        // text = "How you like them apples?";
        break;
      default:
        console.log("");
    }
  };
  numberPadModeChange = event => {
    this.setState({ numberPadMode: event.target.value });
    this.onclickCssClassChange(
      event,
      "mode-button",
      "mode-button selected-mode"
    );
  };
  getProduct = productCode => {
    let searchList = [];
    ReactDOM.render("", document.getElementById("posSearchList"));
    console.log(productCode);
    fetch(API_URL + "/getAllProduct?productCode=" + productCode, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        if (dataRetrived.page.totalPages !== 0) {
          const rawData = dataRetrived._embedded.productGetList;

          rawData.map((n, index) => {
            console.log("iterator");
            searchList.push(
              <PosItem
                product={rawData[index]}
                addShoppingCart={() => this.posItemOnclick(rawData[index], 1)}
              />
            );
            return null;
          });

          ReactDOM.render(searchList, document.getElementById("posSearchList"));
        }
      })
      .catch(err => {
        console.log("Error", err);
        this.setState({ isErrDlgOpen: true });
      });
  };
  openCustomerDialog = () => {
    this.setState({ isPOSPage: false });
    this.setState({
      customerPageClass: "show",
      posPageClass: "hide",
      paymentPageClass: "hide"
    });
  };
  closeCustomerDialog = () => {
    this.setState({ isPOSPage: true });
    this.setState({ customerPageClass: "hide", posPageClass: "show" });
  };

  openPaymentDialog = () => {
    this.setState({ isPOSPage: false });
    this.setState({ paymentPageClass: "show", posPageClass: "hide" });
  };
  closePaymentDialog = () => {
    this.setState({ isPOSPage: true });
    this.setState({ paymentPageClass: "hide", posPageClass: "show" });
  };
  closePos = () => {
    this.setState({ isPOSOpen: false });
  };

  setCustomer = customer => {
    this.setState({
      customer: customer
    });
  };
  render() {
    const { classes } = this.props;
    let posDialogAction;
    if (this.state.isPOSPage) {
      posDialogAction = (
        <Button onClick={this.closePos} variant="contained" color="primary">
          Cancel
        </Button>
      );
    } else {
      posDialogAction = "";
    }
    return (
      <Dialog
        fullScreen
        open={this.state.isPOSOpen}
        onClose={this.closePos}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
      >
        <DialogContent>
          <div className="pos">
            <div className={this.state.posPageClass}>
              <div className="pos-content">
                <div className="window">
                  <div className="subwindow">
                    <div className="subwindow-container">
                      <div className="subwindow-container-fix screens">
                        <div className="product-screen screen">
                          <div className="leftpane">
                            <div className="window">
                              <div className="subwindow">
                                <div className="subwindow-container">
                                  <div className="subwindow-container-fix">
                                    <div className="order-container">
                                      <div className="order-scroller touch-scrollable">
                                        <div className="order">
                                          <InvoiceItem
                                            invoiceItemOnclick={
                                              this.invoiceItemOnclick
                                            }
                                            products={this.state.productList}
                                          />

                                          <div className="summary clearfix">
                                            <div className="line">
                                              <div className="entry total">
                                                <span className="badge">
                                                  Total:{" "}
                                                </span>{" "}
                                                <span className="value">
                                                  Rs{" "}
                                                  {this.state.total.toFixed(2)}
                                                </span>
                                                {/* <div className="subentry">
                                            Taxes:{" "}
                                            <span className="value">
                                              0.00 $
                                            </span>
                                          </div> */}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="subwindow collapsed">
                                <div className="subwindow-container">
                                  <div className="subwindow-container-fix pads">
                                    <div className="actionpad">
                                      <button
                                        className="button set-customer "
                                        onClick={this.openCustomerDialog}
                                      >
                                        <i
                                          aria-label="Customer"
                                          className="fa fa-user"
                                          role="img"
                                          title="Customer"
                                        />
                                        {this.state.customer != null
                                          ? this.state.customer.firstName +
                                            " " +
                                            this.state.customer.lastName
                                          : "Customer"}
                                      </button>
                                      <button
                                        className="button pay"
                                        onClick={this.openPaymentDialog}
                                      >
                                        <div className="pay-circle">
                                          <i
                                            aria-label="Pay"
                                            className="fa fa-chevron-right"
                                            role="img"
                                            title="Pay"
                                          />
                                        </div>
                                        Payment
                                      </button>
                                    </div>
                                    <div className="numpad">
                                      <button
                                        className="input-button number-char"
                                        onClick={this.numberPadClick}
                                        value="1"
                                      >
                                        1
                                      </button>
                                      <button
                                        className="input-button number-char"
                                        onClick={this.numberPadClick}
                                        value="2"
                                      >
                                        2
                                      </button>
                                      <button
                                        className="input-button number-char"
                                        onClick={this.numberPadClick}
                                        value="3"
                                      >
                                        3
                                      </button>
                                      <button
                                        onClick={this.numberPadModeChange}
                                        className="mode-button selected-mode"
                                        value="quantity"
                                      >
                                        Qty
                                      </button>
                                      <br />
                                      <button
                                        className="input-button number-char"
                                        onClick={this.numberPadClick}
                                        value="4"
                                      >
                                        4
                                      </button>
                                      <button
                                        className="input-button number-char"
                                        onClick={this.numberPadClick}
                                        value="5"
                                      >
                                        5
                                      </button>
                                      <button
                                        className="input-button number-char"
                                        onClick={this.numberPadClick}
                                        value="6"
                                      >
                                        6
                                      </button>
                                      <button
                                        onClick={this.numberPadModeChange}
                                        className="mode-button"
                                        value="discount"
                                      >
                                        Disc
                                      </button>
                                      <br />
                                      <button
                                        className="input-button number-char"
                                        onClick={this.numberPadClick}
                                        value="7"
                                      >
                                        7
                                      </button>
                                      <button
                                        className="input-button number-char"
                                        onClick={this.numberPadClick}
                                        value="8"
                                      >
                                        8
                                      </button>
                                      <button
                                        className="input-button number-char"
                                        onClick={this.numberPadClick}
                                        value="9"
                                      >
                                        9
                                      </button>
                                      <button
                                        className="mode-button"
                                        onClick={this.numberPadModeChange}
                                        value="price"
                                      >
                                        Price
                                      </button>
                                      <br />
                                      <button className="input-button numpad-minus">
                                        +/-
                                      </button>
                                      <button
                                        className="input-button number-char"
                                        onClick={this.numberPadClick}
                                        value="0"
                                      >
                                        0
                                      </button>
                                      <button className="input-button number-char">
                                        .
                                      </button>
                                      <button className="input-button numpad-backspace">
                                        <img
                                          alt="Backspace"
                                          height="21"
                                          src={Backspace}
                                          style={{ pointerEvents: "none" }}
                                          width="24"
                                        />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="rightpane">
                            <table className="layout-table">
                              <tbody>
                                <tr className="header-row">
                                  <td className="header-cell">
                                    <div>
                                      <header className="rightpane-header">
                                        <div className="breadcrumbs">
                                          <span className="breadcrumb">
                                            <span className=" breadcrumb-button breadcrumb-home js-category-switch">
                                              <i
                                                aria-label="Home"
                                                className="fa fa-home"
                                                role="img"
                                                title="Home"
                                              />
                                            </span>
                                          </span>
                                        </div>
                                        <div className="searchbox">
                                          <input
                                            placeholder="Search Products"
                                            onChange={this.handleChange}
                                          />
                                          <span className="search-clear" />
                                        </div>
                                      </header>
                                    </div>
                                  </td>
                                </tr>

                                <tr className="content-row">
                                  <td className="content-cell">
                                    <div className="content-container">
                                      <div className="product-list-container">
                                        <div className="product-list-scroller touch-scrollable">
                                          <div
                                            className="product-list"
                                            id="posSearchList"
                                          />
                                        </div>
                                        <span className="placeholder-ScrollbarWidget" />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="keyboard_frame">
                  <ul className="keyboard simple_keyboard">
                    <li className="symbol firstitem row_qwerty">
                      <span className="off">q</span>
                      <span className="on">1</span>
                    </li>
                    <li className="symbol">
                      <span className="off">w</span>
                      <span className="on">2</span>
                    </li>
                    <li className="symbol">
                      <span className="off">e</span>
                      <span className="on">3</span>
                    </li>
                    <li className="symbol">
                      <span className="off">r</span>
                      <span className="on">4</span>
                    </li>
                    <li className="symbol">
                      <span className="off">t</span>
                      <span className="on">5</span>
                    </li>
                    <li className="symbol">
                      <span className="off">y</span>
                      <span className="on">6</span>
                    </li>
                    <li className="symbol">
                      <span className="off">u</span>
                      <span className="on">7</span>
                    </li>
                    <li className="symbol">
                      <span className="off">i</span>
                      <span className="on">8</span>
                    </li>
                    <li className="symbol">
                      <span className="off">o</span>
                      <span className="on">9</span>
                    </li>
                    <li className="symbol lastitem">
                      <span className="off">p</span>
                      <span className="on">0</span>
                    </li>

                    <li className="symbol firstitem row_asdf">
                      <span className="off">a</span>
                      <span className="on">@</span>
                    </li>
                    <li className="symbol">
                      <span className="off">s</span>
                      <span className="on">#</span>
                    </li>
                    <li className="symbol">
                      <span className="off">d</span>
                      <span className="on">%</span>
                    </li>
                    <li className="symbol">
                      <span className="off">f</span>
                      <span className="on">*</span>
                    </li>
                    <li className="symbol">
                      <span className="off">g</span>
                      <span className="on">/</span>
                    </li>
                    <li className="symbol">
                      <span className="off">h</span>
                      <span className="on">-</span>
                    </li>
                    <li className="symbol">
                      <span className="off">j</span>
                      <span className="on">+</span>
                    </li>
                    <li className="symbol">
                      <span className="off">k</span>
                      <span className="on">(</span>
                    </li>
                    <li className="symbol lastitem">
                      <span className="off">l</span>
                      <span className="on">)</span>
                    </li>

                    <li className="symbol firstitem row_zxcv">
                      <span className="off">z</span>
                      <span className="on">?</span>
                    </li>
                    <li className="symbol">
                      <span className="off">x</span>
                      <span className="on">!</span>
                    </li>
                    <li className="symbol">
                      <span className="off">c</span>
                      <span className="on">"</span>
                    </li>
                    <li className="symbol">
                      <span className="off">v</span>
                      <span className="on">'</span>
                    </li>
                    <li className="symbol">
                      <span className="off">b</span>
                      <span className="on">:</span>
                    </li>
                    <li className="symbol">
                      <span className="off">n</span>
                      <span className="on">;</span>
                    </li>
                    <li className="symbol">
                      <span className="off">m</span>
                      <span className="on">,</span>
                    </li>
                    <li className="delete lastitem">delete</li>

                    <li className="numlock firstitem row_space">
                      <span className="off">123</span>
                      <span className="on">ABC</span>
                    </li>
                    <li className="space">&nbsp;</li>
                    <li className="symbol">
                      <span className="off">.</span>
                      <span className="on">.</span>
                    </li>
                    <li className="return lastitem">return</li>
                  </ul>
                  <p className="close_button">close</p>
                </div>
              </div>
              <Dialog
                open={this.state.isErrDlgOpen}
                onClose={this.closeErrorDialog}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
              >
                <DialogTitle>Server Error</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    500 : Internal Server Error
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={this.closeErrorDialog}
                    variant="contained"
                    color="primary"
                  >
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <div className={this.state.customerPageClass}>
              <PosCustomerPage
                closeFunction={this.closeCustomerDialog}
                customer={this.state.customer}
                setCustomerFunction={this.setCustomer}
              />
            </div>
            <div className={this.state.paymentPageClass}>
              >
              <PosPaymentPage
                total={this.state.total}
                closeFunction={this.closePaymentDialog}
                customer={this.state.customer}
                openCustomerPageFunction={this.openCustomerDialog}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>{posDialogAction}</DialogActions>
      </Dialog>
    );
  }
}
export default withStyles(styles)(PosPage);
