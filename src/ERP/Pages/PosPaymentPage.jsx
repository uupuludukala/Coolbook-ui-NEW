import React from "react";

import { withStyles } from "@material-ui/core/styles";
import "../css/pos.css";
import Backspace from "../../assets/img/backspace.png";

const styles = theme => ({});
class PosPaymentPage extends React.Component {
  state = {
    tendered: 0.0,
    change: 0.0,
    paymentMethod: ""
  };
  setPaymentMethod = method => {
    this.setState({ paymentMethod: method });
  };
  render() {
    let cash = "Cash";
    let account = "Account";
    return (
      <div className="pos">
        <div className="pos-content">
          <div className="window">
            <div className="subwindow">
              <div className="subwindow-container">
                <div className="subwindow-container-fix screens">
                  <div className="payment-screen screen">
                    <div className="screen-content">
                      <div className="top-content">
                        <span
                          className="button back"
                          onClick={this.props.closeFunction}
                        >
                          <i className="fa fa-angle-double-left" />
                          Back
                        </span>
                        <h1>Payment</h1>
                        <span className="button next highlight">
                          Validate
                          <i className="fa fa-angle-double-right" />
                        </span>
                      </div>
                      <div className="left-content pc40 touch-scrollable scrollable-y">
                        <div className="paymentmethods-container">
                          <div className="paymentmethods">
                            <div
                              className="button paymentmethod"
                              data-id="8"
                              onClick={() => this.setPaymentMethod(cash)}
                            >
                              Cash (Rs)
                            </div>
                            <div
                              className="button paymentmethod"
                              data-id="8"
                              onClick={() => this.setPaymentMethod(account)}
                            >
                              Account
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="right-content pc60 touch-scrollable scrollable-y">
                        <section className="paymentlines-container">
                          {/* Payent line starts here */}
                          <table className="paymentlines">
                            <colgroup>
                              <col className="due" />
                              <col className="tendered" />
                              <col className="change" />
                              <col className="method" />
                              <col className="controls" />
                            </colgroup>
                            <thead>
                              <tr className="label">
                                <th>Due</th>
                                <th>Tendered</th>
                                <th>Change</th>
                                <th>Method</th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="paymentline selected">
                                <td className="col-due">
                                  {" "}
                                  {this.props.total.toFixed(2)}{" "}
                                </td>
                                <td className="col-tendered edit">
                                  {this.state.tendered}
                                </td>

                                <td className="col-change highlight">
                                  {this.state.change}
                                </td>

                                <td className="col-name">
                                  {" "}
                                  {this.state.paymentMethod}{" "}
                                </td>
                                <td
                                  aria-label="Delete"
                                  className="delete-button"
                                  data-cid="c23"
                                  title="Delete"
                                >
                                  {" "}
                                  <i clclassNameass="fa fa-times-circle" />{" "}
                                </td>
                              </tr>

                              {/* <tr className="paymentline extra" data-cid="0">
                                <td className="col-due"> -7.00 </td>
                              </tr> */}
                            </tbody>
                          </table>
                          {/* Payment line ends here */}
                          <div className="paymentlines-empty">
                            <div className="total">
                              Rs. {this.props.total.toFixed(2)}
                            </div>
                            {/* <div className="message">
                              Please select a payment method.
                            </div> */}
                          </div>
                        </section>

                        <section className="payment-numpad">
                          <div className="numpad">
                            <button
                              className="input-button number-char"
                              data-action="1"
                            >
                              1
                            </button>
                            <button
                              className="input-button number-char"
                              data-action="2"
                            >
                              2
                            </button>
                            <button
                              className="input-button number-char"
                              data-action="3"
                            >
                              3
                            </button>

                            <br />
                            <button
                              className="input-button number-char"
                              data-action="4"
                            >
                              4
                            </button>
                            <button
                              className="input-button number-char"
                              data-action="5"
                            >
                              5
                            </button>
                            <button
                              className="input-button number-char"
                              data-action="6"
                            >
                              6
                            </button>

                            <br />
                            <button
                              className="input-button number-char"
                              data-action="7"
                            >
                              7
                            </button>
                            <button
                              className="input-button number-char"
                              data-action="8"
                            >
                              8
                            </button>
                            <button
                              className="input-button number-char"
                              data-action="9"
                            >
                              9
                            </button>

                            <br />
                            <button
                              className="input-button number-char"
                              data-action="0"
                            >
                              0
                            </button>
                            <button
                              className="input-button number-char"
                              data-action="."
                            >
                              .
                            </button>
                            <button
                              className="input-button numpad-backspace"
                              data-action="BACKSPACE"
                            >
                              <img
                                alt="Backspace"
                                height="21"
                                src={Backspace}
                                width="24"
                              />
                            </button>
                          </div>
                        </section>

                        <div className="payment-buttons">
                          <div
                            className="button js_set_customer"
                            onClick={this.props.openCustomerPageFunction}
                          >
                            <i
                              aria-label="Customer"
                              className="fa fa-user"
                              role="img"
                              title="Customer"
                            />
                            <span className="js_customer_name">
                              {this.props.customer != null
                                ? this.props.customer.firstName +
                                  " " +
                                  this.props.customer.lastName
                                : "Select Customer"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PosPaymentPage);
