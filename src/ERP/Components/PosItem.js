import React from "react";
import { withStyles } from "@material-ui/core/styles";
import "bootstrap/dist/css/bootstrap.css";
import "../css/pos.css";
const styles = {
  card: {
    minWidth: 275,
    width: 100,
    backgound: ""
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  posItem: {
    padding: "5px"
  }
};

class PosItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "" };
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
  }

  handleChange(event) {
    this.setState({ email: event.target.value });
  }

  validate() {
    alert(this.props.className);
  }
  addItem = () => {
    this.props.addShoppingCart();
  };
  render() {
    return (
      <article
        className="product"
        data-product-id="2"
        aria-labelledby="article_product_2"
        tabIndex="0"
        onClick={() => this.addItem(this.props.product)}
      >
        <div className="product-img">
          <img alt="Product " src={this.props.product.imageUrl} />
          <span className="price-tag">Rs. {this.props.product.salePrice}</span>
        </div>
        <div className="product-name" id="article_product_2">
          {this.props.product.productName}
        </div>
      </article>
    );
  }
}

export default withStyles(styles)(PosItem);
