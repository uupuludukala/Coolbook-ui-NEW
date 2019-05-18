import React from "react";

class PosCustomer extends React.Component {
  render() {
    return (
      <tr
        className="client-line"
        data-id="7"
        onClick={() => this.props.selectCustomerFuction(this.props.customer)}
      >
        <td>
          {this.props.customer.firstName} {this.props.customer.lastName}
        </td>
        <td>
          {this.props.customer.addressLine1} {this.props.customer.addressLine2}{" "}
          {this.props.customer.addressLine3}{" "}
        </td>

        <td>{this.props.customer.mobileNumer}</td>
      </tr>
    );
  }
}

export default PosCustomer;
