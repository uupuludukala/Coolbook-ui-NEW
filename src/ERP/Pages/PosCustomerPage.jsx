import React from "react";
import ReactDOM from "react-dom";
import { withStyles } from "@material-ui/core/styles";
import "../css/pos.css";
import PosCustomer from "../Components/PosCustomer";
import { API_URL } from "../properties/applicationProperties";

const styles = theme => ({});
class PosCustomerPage extends React.Component {
  state = {
    nicNumber: "",
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    mobileNumer: "",
    homePhone: "",
    creditLimit: "",
    isCustomerSelected: false
  };
  searchCustomer = event => {
    this.renderCustomer(event.target.value);
  };
  setCustomer = customer => {
    if (this.props.selectedCustomerId !== customer.id) {
      this.setState({ setCustomerLabel: "Change Customer" });
    }
    this.setState({
      nicNumber: customer.nicNumber,
      firstName: customer.firstName,
      lastName: customer.lastName,
      addressLine1: customer.addressLine1,
      addressLine2: customer.addressLine2,
      addressLine3: customer.addressLine3,
      mobileNumer: customer.mobileNumer,
      homePhone: customer.homePhone,
      creditLimit: customer.creditLimit,
      customer: customer,
      isCustomerSelected: true,
      setCustomerLabel: "Set Customer"
    });
  };
  setCustomerToPos = () => {
    if (this.props.isCustomerSet) {
      this.props.setCustomerFunction("Customer", false);
      this.setState({ isCustomerSelected: false });
      this.props.closeFunction();
    } else if (this.state.isCustomerSelected) {
      this.props.setCustomerFunction(this.state.customer, true);
      this.props.closeFunction();
    }
  };
  renderCustomer = customerCode => {
    let searchList = [];
    ReactDOM.render("", document.getElementById("posCustomerList"));
    fetch(API_URL + "/getAllCustomer?nicNumber=" + customerCode)
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        if (dataRetrived.page.totalPages !== 0) {
          const rawData = dataRetrived._embedded.customerGetList;
          console.log();
          rawData.map((n, index) => {
            console.log("iterator");
            searchList.push(
              <PosCustomer
                customer={rawData[index]}
                setCustomerFuction={() => this.setCustomer(rawData[index])}
              />
            );
            console.log("Customer " + rawData[index]);
            return null;
          });

          ReactDOM.render(
            searchList,
            document.getElementById("posCustomerList")
          );
        }
      })
      .catch(err => {
        console.log("Error", err);
        this.setState({ isErrDlgOpen: true });
      });
  };

  render() {
    let isCustomerSet = this.props.isCustomerSet;
    if (isCustomerSet) {
      this.setState({ setCustomerLabel: "Deselect Customer" });
    }

    return (
      <div className="pos">
        <div className="pos-content">
          <div className="window">
            <div className="subwindow">
              <div className="subwindow-container">
                <div className="subwindow-container-fix screens">
                  <div className="clientlist-screen screen">
                    <div className="screen-content">
                      <section className="top-content">
                        <span
                          className="button back"
                          onClick={this.props.closeFunction}
                        >
                          <i className="fa fa-angle-double-left" />
                          Cancel
                        </span>
                        <span className="searchbox">
                          <input
                            placeholder="Search Customers"
                            onChange={this.searchCustomer}
                          />
                          <span className="search-clear" />
                        </span>
                        <span className="searchbox" />

                        <span
                          className="button next highlight"
                          onClick={this.setCustomerToPos}
                        >
                          {this.state.setCustomerLabel}
                        </span>
                      </section>
                      <section className="full-content">
                        <div className="window">
                          <section className="subwindow collapsed">
                            <div className="subwindow-container collapsed">
                              <div className="subwindow-container-fix client-details-contents" />
                            </div>
                          </section>
                          <section
                            className="subwindow collapsed"
                            style={{
                              display: this.state.isCustomerSelected
                                ? "block"
                                : "none"
                            }}
                          >
                            <div className="subwindow-container collapsed">
                              <div className="subwindow-container-fix client-details-contents">
                                <section className="client-details">
                                  <div className="client-picture">
                                    <img
                                      alt="Partner logo"
                                      src="/web/image?model=res.partner&amp;id=7&amp;field=image_small"
                                    />
                                  </div>
                                  <div className="client-name">
                                    {this.state.firstName} {this.state.lastName}
                                  </div>
                                  <div className="client-details-box clearfix">
                                    <div className="client-details-left">
                                      <div className="client-detail">
                                        <span className="label">Address</span>

                                        <span className="detail client-address">
                                          {this.state.addressLine1}
                                          {","}
                                          {this.state.addressLine3}
                                          {","}
                                          {this.state.addressLine3}
                                        </span>
                                      </div>
                                      <div className="client-detail">
                                        <span className="label">
                                          Mobile Phone
                                        </span>

                                        <span className="detail">
                                          {this.state.mobileNumer}
                                        </span>
                                      </div>
                                      <div className="client-detail">
                                        <span className="label">
                                          Home Phone
                                        </span>

                                        <span className="detail">
                                          {this.state.homePhone}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="client-details-right">
                                      <div className="client-detail">
                                        <span className="label">NIC</span>

                                        <span className="detail">
                                          {this.state.nicNumber}
                                        </span>
                                      </div>
                                      <div className="client-detail">
                                        <span className="label">
                                          Credit Limit
                                        </span>

                                        <span className="detail">
                                          {this.state.creditLimit}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </div>
                          </section>
                          <section className="subwindow">
                            <div className="subwindow-container">
                              <div className="subwindow-container-fix touch-scrollable scrollable-y">
                                <table className="client-list">
                                  <thead>
                                    <tr>
                                      <th>Name</th>
                                      <th>Address</th>
                                      <th>Phone</th>
                                    </tr>
                                  </thead>
                                  <tbody
                                    className="client-list-contents"
                                    id="posCustomerList"
                                  />
                                </table>
                              </div>
                            </div>
                          </section>
                        </div>
                      </section>
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
export default withStyles(styles)(PosCustomerPage);
