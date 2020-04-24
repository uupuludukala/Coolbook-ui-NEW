import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { API_URL } from "../properties/applicationProperties";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from "react-material-ui-form-validator";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Typography from "@material-ui/core/Typography";
import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle.jsx";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}
class ProductCategoryForm extends React.Component {
  state = {
    imageUrl: "",
    venderTaxes: [],
    tabValue: 0,
    productType: 0,
    productCategoryList: []
  };
  resetForm = () => {
    this.refs.form.resetValidations();
  };
  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleChangeByName = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  componentDidMount() {
    this.getProductCategory();
  }

  submitform = () => {
    this.refs.form.submit();
  };
  enableEditMode = () => {
    this.setState({
      saveMode: "Update"
    });
  };

  enableAddMode = () => {
    this.setState({
      saveMode: "Add"
    });
  };

  clearForm = () => {
    this.setState({
      parentCategory: 0,
      productCatCode: "",
      productCatName: ""
    });
  };

  setFormData = dataRetrived => {
    console.log("dataRetrived", dataRetrived);
    this.setState({ ...dataRetrived });
    this.disableFormElements();
  };
  disableFormElements = () => {
    this.setState({ disableFormElements: true });
  };

  enableFormElements = () => {
    this.setState({ disableFormElements: false });
  };
  deleteProductCategory = () => {
    fetch(API_URL + "/deleteProductCategory/" + this.state.id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        "Access-Control-Allow-Origin": "*"
      },
      method: "DELETE"
    })
      .then(response => {
        if (response.status === 200) {
          this.props.reloadFunction();
          this.props.showNotification("Deleted Successfully", "success");
        } else {
          console.log("Error Saving Data");
          this.props.showNotification("Error on deleting data", "danger");
        }
      })
      .catch(error => {
        console.log("error Saving Data catch" + error);
        this.props.showNotification("Error on deleting data", "danger");
      });
  };

  save = () => {
    const product = {
      parentCategory: this.state.parentCategory,
      productCatCode: this.state.productCatCode,
      productCatName: this.state.productCatName
    };
    let requestMethod = this.state.saveMode === "Update" ? "PUT" : "POST";
    fetch(
      API_URL +
        (this.state.saveMode === "Update"
          ? "/saveProductCategory/" + this.state.id
          : "/saveProductCategory"),
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
          this.disableFormElements();
          this.props.reloadFunction();
          this.props.showNotification("Saved Successfully", "success");
          this.props.getProductCategoryByLocation(response.headers.get("Location"));
          this.props.disableSaveButtons(true);
        } else {
          console.log("Error Saving Data");
          this.props.showNotification("Error on saving data", "danger");
        }
      })
      .catch(error => {
        this.props.showNotification("Error on saving data", "danger");
      });
  };

  getProductCategory = () => {
    fetch(API_URL + "/getAllProductCategory", {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        const rawData = dataRetrived._embedded.productCategoryGetList;

        this.setState({
          productCategoryList: rawData
        });
      })
      .catch(err => {
        // Do something for an error here
        console.log("Error", err);
      });
  };
  render() {
    const imageContainer = {
      boxShadow: "10px 10px 5px grey",
      border: "0.5px solid black",
      display: "block",
      width: "105px",
      height: "105px"
    };
    const imageViewer = {
      display: "block",
      width: "100px",
      height: "100px",
      padding: "2px"
    };
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250
        }
      }
    };
    const names = [
      "Oliver Hansen",
      "Van Henry",
      "April Tucker",
      "Ralph Hubbard",
      "Omar Alexander",
      "Carlos Abbott",
      "Miriam Wagner",
      "Bradley Wilkerson",
      "Virginia Andrews",
      "Kelly Snyder"
    ];
    const { classes } = this.props;
    return (
      <ValidatorForm
        ref="form"
        onSubmit={this.save}
        onError={errors => console.log(errors)}
      >
        <GridContainer>
          <GridItem>
            <FormControl required className={classes.formControl}>
              <SelectValidator
                disabled={this.state.disableFormElements}
                name="parentCategory"
                label="Parent Category"
                value={this.state.parentCategory}
                onChange={this.handleChange}
                validators={["required"]}
                errorMessages={["Product Category Required"]}
                input={<Input name="parentCategory" id="parentCategory" />}
                InputLabelProps={{
                  shrink: true
                }}
              >
                <MenuItem value="0">All</MenuItem>
                {this.state.productCategoryList.map(
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
                label="Category Code"
                disabled={this.state.disableFormElements}
                name="productCatCode"
                validators={["required"]}
                errorMessages={["Product Name Required"]}
                value={this.state.productCatCode}
                onChange={this.handleChange}
                margin="dense"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
            <br />

            <FormControl required className={classes.formControl}>
              <TextValidator
                disabled={this.state.disableFormElements}
                name="productCatName"
                validators={["required"]}
                errorMessages={["Product Name Required"]}
                value={this.state.productCatName}
                label="Category Name"
                onChange={this.handleChange}
                margin="dense"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
            <br />
          </GridItem>
        </GridContainer>
      </ValidatorForm>
      //   </GridItem>
      // </GridContainer>
    );
  }
}

export default withStyles(customInputStyle)(ProductCategoryForm);
