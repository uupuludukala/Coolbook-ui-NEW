import React from "react";

class InvoiceItem extends React.Component {
  itemOnclick = (event, product) => {
    console.log("Event", event);
    this.props.invoiceItemOnclick(event, product);
  };
  render() {
    const data = Object.keys(this.props.products);
    return (
      <ul className="orderlines">
        {data.map(datarow => {
          return (
            <li
              className="orderline"
              onClick={event =>
                this.itemOnclick(event, this.props.products[datarow])
              }
            >
              <span className="product-name">
                {this.props.products[datarow].productName}
              </span>
              <span className="price">
                {console.log("sasads", this.props.products[datarow].salePrice)}
                Rs.{" "}
                {parseFloat(
                  this.props.products[datarow].totalForProduct
                ).toFixed(2)}
              </span>
              <ul className="info-list">
                <li className="info">
                  <em>{this.props.products[datarow].quantity}</em>
                  Unit(s) at{" "}
                  {parseFloat(this.props.products[datarow].salePrice).toFixed(
                    2
                  )}{" "}
                  / Unit(s)
                </li>
              </ul>
            </li>
          );
        })}
      </ul>
    );
  }
}
export default InvoiceItem;
