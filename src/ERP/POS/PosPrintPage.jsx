import React from "react";
import { withStyles } from "@material-ui/core/styles";
import "../css/pos.css";
import ReactToPrint from "react-to-print";

const styles = theme => ({});
class PosPrintPage extends React.Component {
  nextOrder = () => {
    this.props.closePrintPageFucntion();
  };
  render() {
    return (
      <div className="pos">
        <div className="pos-content">
          <div className="window">
            <div className="subwindow">
              <div className="subwindow-container">
                <div className="subwindow-container-fix screens">
                  <div className="receipt-screen screen">
                    <div className="screen-content">
                      <div className="top-content">
                        <h1>
                          Change: <span className="change-value">452.85 $</span>
                        </h1>
                        <span
                          className="button next highlight"
                          onClick={this.nextOrder}
                        >
                          Next Order
                          <i className="fa fa-angle-double-right" />
                        </span>
                      </div>
                      <div className="centered-content touch-scrollable">
                        <div
                          className="button print_invoice"
                          style={{
                            display: "none"
                          }}
                        >
                          <i className="fa fa-print" /> Print Invoice
                        </div>
                        <div className="button print">
                          {/* <i className="fa fa-print" /> Print Receipt */}
                          <ReactToPrint
                            trigger={() => (
                              <i href="#" className="fa fa-print">
                                Print Receipt
                              </i>
                            )}
                            content={() => this.componentRef}
                          />
                        </div>
                        <Receipt ref={el => (this.componentRef = el)} />
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
export default withStyles(styles)(PosPrintPage);

class Receipt extends React.Component {
  render() {
    return (
      <div className="pos-receipt-container">
        <div className="pos-receipt">
          <br />
          <div className="pos-receipt-contact">
            <div>furnico</div>
            <div>upuludukala2@gmail.com</div>
            <div>http://www.yourcompany.com</div>
            <div className="cashier">
              <div>--------------------------------</div>
              <div>Served by Upul Udukala</div>
            </div>
          </div>
          <br />
          <br />
          <div className="orderlines">
            <div>
              Discount
              <span className="price_display pos-receipt-right-align">
                0.00
              </span>
            </div>
            <div>
              Tips
              <span className="price_display pos-receipt-right-align">
                1.00
              </span>
            </div>
          </div>
          <div className="pos-receipt-right-align">--------</div>
          <br />
          <div className="pos-receipt-amount">
            TOTAL
            <span className="pos-receipt-right-align">1.00 $</span>
          </div>
          <br />
          <br />
          <div>
            Cash
            <span className="pos-receipt-right-align">453.85</span>
          </div>
          <br />
          <div className="pos-receipt-amount receipt-change">
            CHANGE
            <span className="pos-receipt-right-align">452.85 $</span>
          </div>
          <br />
          <div>
            Total Taxes
            <span className="pos-receipt-right-align">0.00 $</span>
          </div>
          <div className="before-footer" />
          <div className="after-footer" />
          <br />
          <div className="pos-receipt-order-data">
            <div>Order 00001-001-0001</div>
            <div>11/28/2019, 8:05:14 AM</div>
          </div>
        </div>
      </div>
    );
  }
}
