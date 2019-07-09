import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import { API_URL } from "../properties/applicationProperties";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import AddAlert from "@material-ui/icons/AddAlert";
import MenuItem from "@material-ui/core/MenuItem";
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
  }
});

class ProductForm extends React.Component {
  state = {
    ...this.props.formData,
    mode: this.props.mode,
    productCategoryList: [],
    isNotificationOpen: false
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
    if (this.state.id == this.state.parentCategory) {
      this.setState({
        notification: "Cant Create recursive categories",
        isNotificationOpen: true
      });
    }
    const productCategory = {
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
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("access_token")
        },
        method: requestMethod,
        body: JSON.stringify(productCategory)
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
  };
  closeForm = () => {
    this.props.closefunction();
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <ValidatorForm
          ref="form"
          onSubmit={this.submitform}
          onError={errors => console.log(errors)}
        >
          <FormControl required className={classes.formControl}>
            <SelectValidator
              label="Parent Category"
              value={this.state.parentCategory}
              onChange={this.handleChange}
              validators={["required"]}
              errorMessages={["Parent Category Required"]}
              InputLabelProps={{
                shrink: true
              }}
              name="parentCategory"
              input={<Input name="parentCategory" id="parentCategory" />}
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
          <FormControl className={classes.formControl}>
            <TextValidator
              name="productCatCode"
              value={this.state.productCatCode}
              onChange={this.handleChange}
              label="Product Category Code"
              validators={["required"]}
              errorMessages={["Product Category Code Required"]}
              InputLabelProps={{
                shrink: true
              }}
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <br />

          <FormControl className={classes.formControl}>
            <TextValidator
              name="productCatName"
              value={this.state.productCatName}
              onChange={this.handleChange}
              label="Product Category Name"
              validators={["required"]}
              errorMessages={["Product Category Name Required"]}
              InputLabelProps={{
                shrink: true
              }}
              margin="dense"
            />
          </FormControl>
          <br />

          {/* <Tooltip title="Save" aria-label="Add" >
                        <Button variant="contained" color="primary" onClick={this.submitform}>Save</Button>
                    </Tooltip>
                    <Button variant="contained" color="primary" onClick={this.clearForm}>Clear</Button>
                    <Button variant="contained" color="primary" onClick={this.closeForm}>Close</Button> */}
          <Button type="submit" color="primary">
            Save
          </Button>
          <Button onClick={this.clearForm} color="primary">
            Clear
          </Button>
          <Button onClick={this.closeForm} color="primary">
            Cancel
          </Button>
        </ValidatorForm>
        <Snackbar
          place="tl"
          color="info"
          icon={AddAlert}
          message={this.state.notification}
          open={this.state.isNotificationOpen}
          closeNotification={() => this.setState({ isNotificationOpen: false })}
          close
        />
      </div>
    );
  }
}

ProductForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductForm);
