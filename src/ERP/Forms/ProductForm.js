import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import { API_URL } from "../properties/applicationProperties";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import "../css/pos.css";
import CardMedia from "@material-ui/core/CardMedia";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    width: "50%",
    margin: theme.spacing.unit,
    minWidth: 120,
    fullWidth: false,
    wrap: "nowrap"
  },
  card: {
    maxWidth: 345
  },
  media: {
    //  object-fit is not supported by IE 11.
    objectFit: "cover"
  }
});

class ProductForm extends React.Component {
  state = {
    ...this.props.formData,
    mode: this.props.mode,
    productCategoryList: [],
    productType: "#"
  };

  handleChangeByName = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  clearForm = () => {
    this.setState({
      active: false,
      barcode: "",
      cost: 0,
      productCategory: "#",
      productCode: "",
      productName: "",
      productType: "#",
      quantity: 0,
      salePrice: 0
    });
  };
  submitform = () => {
    if (this.validateForm()) {
      const product = {
        active: this.state.active,
        barcode: this.state.barcode,
        cost: this.state.cost,
        productCategory: this.state.productCategory,
        productCode: this.state.productCode,
        productName: this.state.productName,
        productType: this.state.productType,
        quantity: this.state.quantity,
        salePrice: this.state.salePrice,
        imageUrl: this.state.productImageUrl
      };
      let requestMethod = this.state.mode === "Update" ? "PUT" : "POST";
      fetch(
        API_URL +
          (this.state.mode === "Update"
            ? "/saveProduct/" + this.state.id
            : "/saveProduct"),
        {
          headers: { "Content-Type": "application/json" },
          method: requestMethod,
          body: JSON.stringify(product)
        }
      )
        .then(response => {
          if (response.status === 201 || response.status === 200) {
            this.closeForm();
            this.props.getDataFunction(0);
            // this.clearForm();
          } else {
            console.log("Error Saving Data");
          }
        })
        .catch(error => {
          console.log("error Saving Data catch" + error);
        });
    }
  };
  closeForm = () => {
    this.props.closefunction();
  };
  validateForm = () => {
    let isValid = true;
    if (this.state.barcode === "") {
      this.setState({
        barcodeError: true,
        barcodeHelperText: "Bar code Required"
      });
      isValid = false;
    } else {
      this.setState({
        barcodeError: false,
        barcodeHelperText: ""
      });
    }
    if (this.state.cost === "") {
      this.setState({
        costError: true,
        costHelperText: "Cost Required"
      });
      isValid = false;
    } else {
      this.setState({
        costError: false,
        costHelperText: ""
      });
    }
    if (this.state.productCategory === "#") {
      this.setState({
        productCategoryError: true,
        productCategoryHelperText: "Product CategoryRequired"
      });
      isValid = false;
    } else {
      this.setState({
        productCategoryError: false,
        productCategoryHelperText: ""
      });
    }
    if (this.state.productCode === "") {
      this.setState({
        productCodeError: true,
        productCodeHelperText: "Product Code Required"
      });
      isValid = false;
    } else {
      this.setState({
        productCodeError: false,
        productCodeHelperText: ""
      });
    }
    if (this.state.productName === "") {
      this.setState({
        productNameError: true,
        productNameHelperText: "Product Name Required"
      });
      isValid = false;
    } else {
      this.setState({
        productNameError: false,
        productNameHelperText: ""
      });
    }
    if (this.state.productType === "#") {
      this.setState({
        productTypeError: true,
        productTypeHelperText: "Product Type Required"
      });
      isValid = false;
    } else {
      this.setState({
        productTypeError: false,
        productTypeHelperText: ""
      });
    }
    if (this.state.quantity === "") {
      this.setState({
        quantityError: true,
        quantityHelperText: "Quantity Required"
      });
      isValid = false;
    } else {
      this.setState({
        quantityError: false,
        quantityHelperText: ""
      });
    }
    if (this.state.salePrice === "") {
      this.setState({
        salePriceError: true,
        salePriceHelperText: "SalePrice Required"
      });
      isValid = false;
    } else {
      this.setState({
        salePriceError: false,
        salePriceHelperText: ""
      });
    }
    return isValid;
  };
  uploadFile = () => {
    console.log("File Upload Finction call");
    let file = document.getElementById("productImage").files[0];
    var formData = new FormData();
    formData.append("file", file);
    console.log("file", file);
    fetch(API_URL + "/uploadFile", {
      headers: {
        // "Content-Type": "multipart/form-data"
      },
      method: "post",
      body: formData
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        console.log("dataRetrived", dataRetrived);
        this.setState({
          productImageUrl: dataRetrived.fileDownloadUri
        });
      })
      .catch(error => {
        console.log("error Saving Data catch" + error);
      });
  };
  render() {
    const { classes } = this.props;

    return (
      <div>
        <form autoComplete="off">
          <div className="pos">
            <article
              className="product"
              data-product-id="2"
              aria-labelledby="article_product_2"
              tabIndex="0"
            >
              <div className="product-img">
                <img alt="Product " src={this.state.productImageUrl} />
                <span className="price-tag" />
              </div>
              <div className="product-name" id="article_product_2" />
            </article>
          </div>
          <br />
          <FormControl className={classes.formControl}>
            <input
              type="file"
              onChange={() => this.uploadFile()}
              id="productImage"
            />
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.active}
                  name="active"
                  onChange={this.handleChangeByName("active")}
                  label="Active"
                  color="primary"
                >
                  {" "}
                </Switch>
              }
              label="Active"
            />
          </FormControl>
          <br />

          <FormControl className={classes.formControl}>
            <TextField
              required={true}
              name="barcode"
              value={this.state.barcode}
              onChange={this.handleChange}
              label="Barcode"
              error={this.state.barcodeError}
              helperText={this.state.barcodeHelperText}
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <br />

          <FormControl className={classes.formControl}>
            <TextField
              required={true}
              type="number"
              name="cost"
              value={this.state.cost}
              onChange={this.handleChange}
              label="Cost"
              error={this.state.costError}
              helperText={this.state.costHelperText}
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <br />
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="productCategory">Product Category</InputLabel>
            <Select
              value={this.state.productCategory}
              native
              onChange={this.handleChange}
              error={this.state.productCategoryError}
              helperText={this.state.productCategoryHelperText}
              input={<Input name="productCategory" id="productCategory" />}
            >
              <option value="#">None</option>
              {this.props.productCategoryList.map(
                n => (
                  <option value={n.id}>{n.productCatCode}</option>
                ),
                this
              )}
            </Select>
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <TextField
              required={true}
              error={this.state.productCodeError}
              helperText={this.state.productCodeHelperText}
              name="productCode"
              value={this.state.productCode}
              onChange={this.handleChange}
              label="Product Code"
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <TextField
              required={true}
              error={this.state.productNameError}
              helperText={this.state.productNameHelperText}
              name="productName"
              value={this.state.productName}
              onChange={this.handleChange}
              label="Product Name"
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <br />
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="productType">Product Type</InputLabel>
            <Select
              value={this.state.productType}
              error={this.state.productTypeError}
              helperText={this.state.productTypeHelperText}
              onChange={this.handleChange}
              input={<Input name="productType" id="productType" />}
            >
              <option value="#">None</option>
              <option value="olivier">Olivier</option>
              <option value="kevin">Kevin</option>
            </Select>
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <TextField
              required={true}
              error={this.state.quantityError}
              helperText={this.state.quantityHelperText}
              type="number"
              name="quantity"
              value={this.state.quantity}
              onChange={this.handleChange}
              label="Quantity"
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <TextField
              required={true}
              error={this.state.salePriceError}
              helperText={this.state.salePriceHelperText}
              type="number"
              name="salePrice"
              value={this.state.salePrice}
              onChange={this.handleChange}
              label="Sale Price"
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <br />

          {/* <Tooltip title="Save" aria-label="Add" >
                        <Button variant="contained" color="primary" onClick={this.submitform}>Save</Button>
                    </Tooltip>
                    <Button variant="contained" color="primary" onClick={this.clearForm}>Clear</Button>
                    <Button variant="contained" color="primary" onClick={this.closeForm}>Close</Button> */}
          <Button onClick={this.submitform} color="primary">
            Save
          </Button>
          <Button onClick={this.clearForm} color="primary">
            Clear
          </Button>
          <Button onClick={this.closeForm} color="primary">
            Cancel
          </Button>
        </form>
      </div>
    );
  }
}

ProductForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductForm);
