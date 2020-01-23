import React from "react";
import ReactDOM from "react-dom";
import PosItem from "../Components/PosItem.js";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { API_URL } from "../properties/applicationProperties";
import "../css/pos.css";
import NumberPad from "../Components/NumberPad";
import TableBody from "@material-ui/core/TableBody";

import InvoiceProductTable from "../Components/InvoiceProductTable";
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
    productCode: "",
    shoppingCartList: [],
    headers: ["Code", "name", "Price", "Qty"]
  };

  handleChange = event => {
    this.setState({ productCode: event.target.value });
    this.getProduct(event.target.value);
  };
  cancelPos = () => {
    // ReactDOM.render(<MainPage />, document.getElementById("root"));
  };
  addShoppingCart = product => {
    this.state.shoppingCartList.push(product);
    this.setState({ shoppingCartList: this.state.shoppingCartList });
    console.log("Item Added to the List" + product.salePrice);
  };
  renderInvoiceItem = () => {
    return this.state.shoppingCartList.map((n, index) => {
      return <TableBody>{this.state.shoppingCartList[index]}</TableBody>;
    });
  };
  getProduct = productCode => {
    let searchList = [];
    ReactDOM.render("", document.getElementById("posSearchList"));
    console.log(productCode);
    fetch(API_URL + "/getAllProduct?productCode=" + productCode)
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
                addShoppingCart={() => this.addShoppingCart(rawData[index])}
              />
            );
            return null;
          });

          ReactDOM.render(searchList, document.getElementById("posSearchList"));
        }
        console.log("Data Retrieved");
      })
      .catch(err => {
        console.log("Error", err);
      });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.row}>
        <div className={classes.productColumn} id="selectedItems">
          <div className={classes.invoiceProduct}>
            <InvoiceProductTable
              headers={this.state.headers}
              dataList={this.state.shoppingCartList}
            />
          </div>
          <di className={classes.numberPad}>
            <NumberPad />
            <TextField>as</TextField>
          </di>
        </div>
        <div className={classes.column}>
          <div className={classes.productSearch}>
            <TextField
              id="productCode"
              name="productCode"
              label="Enter Product Code Here"
              style={{ margin: 8 }}
              onChange={this.handleChange}
              placeholder="Product Code"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
            />
          </div>
          <div id="posSearchList" className="productList" />

          <Button variant="contained" color="primary" onClick={this.cancelPos}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(PosPage);
