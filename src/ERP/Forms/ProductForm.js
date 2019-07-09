import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import { API_URL } from "../properties/applicationProperties";
import MenuItem from "@material-ui/core/MenuItem";
import "../css/pos.css";
import { PRODUCT_TYPE_LIST } from "../properties/applicationProperties";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from "react-material-ui-form-validator";

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
    productCategoryList: []
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
      productCode: "",
      productName: "",
      quantity: 0,
      salePrice: 0
    });
  };
  submitform = () => {
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
      imageUrl: this.state.imageUrl
    };
    let requestMethod = this.state.mode === "Update" ? "PUT" : "POST";
    fetch(
      API_URL +
        (this.state.mode === "Update"
          ? "/saveProduct/" + this.state.id
          : "/saveProduct"),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("access_token")
        },
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
  };
  closeForm = () => {
    this.props.closefunction();
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
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
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
          imageUrl: dataRetrived.fileDownloadUri
        });
      })
      .catch(error => {
        console.log("error Saving Data catch" + error);
      });
  };

  render() {
    const { classes } = this.props;
    const { email } = this.state;
    return (
      <div>
        <ValidatorForm
          ref="form"
          onSubmit={this.submitform}
          onError={errors => console.log(errors)}
        >
          <div className="pos">
            <article
              className="product"
              data-product-id="2"
              aria-labelledby="article_product_2"
              tabIndex="0"
            >
              <div className="product-img">
                <img alt="Product " src={this.state.imageUrl} />
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
          <FormControl required className={classes.formControl}>
            <TextValidator
              name="barcode"
              value={this.state.barcode}
              onChange={this.handleChange}
              label="Barcode"
              validators={["required"]}
              errorMessages={["Barcode Required"]}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <br />
          <FormControl required className={classes.formControl}>
            <TextValidator
              type="number"
              name="cost"
              value={this.state.cost}
              onChange={this.handleChange}
              label="Cost"
              validators={["required"]}
              errorMessages={["Cost Required"]}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <br />
          <FormControl required className={classes.formControl}>
            <SelectValidator
              name="productCategory"
              label="Product Category"
              value={this.state.productCategory}
              onChange={this.handleChange}
              validators={["required"]}
              errorMessages={["Product Category Required"]}
              input={<Input name="productCategory" id="productCategory" />}
              InputLabelProps={{
                shrink: true
              }}
            >
              <MenuItem value="0">All</MenuItem>
              {this.props.productCategoryList.map(
                n => (
                  <MenuItem value={n.id}>{n.productCatCode}</MenuItem>
                ),
                this
              )}
            </SelectValidator>
          </FormControl>
          <br />
          <FormControl required className={classes.formControl}>
            <TextValidator
              name="productCode"
              value={this.state.productCode}
              onChange={this.handleChange}
              label="Product Code"
              validators={["required"]}
              errorMessages={["Product Code Required"]}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <br />
          <FormControl required className={classes.formControl}>
            <TextValidator
              name="productName"
              validators={["required"]}
              errorMessages={["Product Name Required"]}
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
            <SelectValidator
              label="Product Type"
              name="productType"
              validators={["required"]}
              errorMessages={["Product Type Required"]}
              value={this.state.productType}
              onChange={this.handleChange}
              input={<Input name="productType" id="productType" />}
              InputLabelProps={{
                shrink: true
              }}
            >
              <MenuItem value="0">All</MenuItem>
              {PRODUCT_TYPE_LIST.map(
                n => (
                  <MenuItem value={n}>{n}</MenuItem>
                ),
                this
              )}
            </SelectValidator>
          </FormControl>
          <br />
          <FormControl required className={classes.formControl}>
            <TextValidator
              type="number"
              name="quantity"
              validators={["required"]}
              errorMessages={["Quantity Required"]}
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
          <FormControl required className={classes.formControl}>
            <TextValidator
              type="number"
              name="salePrice"
              validators={["required"]}
              errorMessages={["Sale Price Required"]}
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
          <Button type="submit" color="primary">
            Save
          </Button>
          {/* <Button onClick={this.submitform} color="primary">
            Save
          </Button> */}
          <Button onClick={this.clearForm} color="primary">
            Clear
          </Button>
          <Button onClick={this.closeForm} color="primary">
            Cancel
          </Button>
        </ValidatorForm>
      </div>
    );
  }
}

ProductForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductForm);
