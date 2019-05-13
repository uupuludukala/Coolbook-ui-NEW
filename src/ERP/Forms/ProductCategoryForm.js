import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { API_URL } from "../properties/applicationProperties";

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
      parentCategory: "",
      productCatCode: "",
      productCatName: ""
    });
  };
  submitform = () => {
    if (this.validateForm()) {
      const product = {
        parentCategory: this.state.parentCategory,
        productCatCode: this.state.productCatCode,
        productCatName: this.state.productCatName
      };
      let requestMethod = this.state.mode === "Update" ? "PUT" : "POST";
      fetch(
        API_URL +
          (this.state.mode === "Update"
            ? "/updateProductCategory/" + this.state.id
            : "/saveProductCategory"),
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
            this.props.getProductCategoryListFucntion();
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
    if (this.state.productCatCode === "") {
      this.setState({
        productCatCodeError: true,
        productCatCodeHelperText: "Product Category  Code  Required"
      });
      isValid = false;
    } else {
      this.setState({
        productCatCodeError: false,
        productCatCodeHelperText: ""
      });
    }
    if (this.state.productCatName === "") {
      this.setState({
        productCatNameError: true,
        productCatNameHelperText: "Product Category Name Required"
      });
      isValid = false;
    } else {
      this.setState({
        productCatNameError: false,
        productCatNameHelperText: ""
      });
    }
    return isValid;
  };
  render() {
    const { classes } = this.props;

    return (
      <div>
        <form autoComplete="off">
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="parentCategory">Parent Category</InputLabel>
            <Select
              value={this.state.parentCategory}
              native
              onChange={this.handleChange}
              error={this.state.parentCategoryError}
              helperText={this.state.parentCategoryHelperText}
              input={<Input name="parentCategory" id="parentCategory" />}
            >
              {this.props.productCategoryList.map(
                n => (
                  <option value={n.id}>{n.productCatCode}</option>
                ),
                this
              )}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              required={true}
              name="productCatCode"
              value={this.state.productCatCode}
              onChange={this.handleChange}
              label="Product Category Code"
              error={this.state.productCatCodeError}
              helperText={this.state.productCatCodeHelperText}
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
              name="productCatName"
              value={this.state.productCatName}
              onChange={this.handleChange}
              label="Product Category Name"
              error={this.state.productCatNameError}
              helperText={this.state.productCatNameHelperText}
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
