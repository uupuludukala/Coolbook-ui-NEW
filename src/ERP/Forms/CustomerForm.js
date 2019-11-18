import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { API_URL } from "../properties/applicationProperties";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import { PRODUCT_TYPE_LIST } from "../properties/applicationProperties";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import InputLabel from "@material-ui/core/InputLabel";
import Camera from "@material-ui/icons/CameraEnhance";
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
class CustomerForm extends React.Component {
  state = {
    imageUrl: "",
    venderTaxes: [],
    tabValue: 0,
    customerType: 0,
    customerCategoryList: []
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
  handleChangeForVenderTaxes = event => {
    console.log("event.target.value" + event.target.value);
    const value = [];
    for (let i = 0, l = event.target.value.length; i < l; i += 1) {
      value.push(event.target.value[i]);
    }

    this.setState({ venderTaxes: value });
    // this.state.venderTaxes.push(event.target.value);
    // this.setState({ [event.target.name]: event.target.value });
  };

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
      nicNumber: "",
      customerName: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      mobileNumer: "",
      homePhone: "",
      creditLimit: "0.00"
    });
  };

  setFormData = dataRetrived => {
    console.log("dataRetrived", dataRetrived);
    this.setState({ ...dataRetrived });
    this.disableFormElements();
    console.log("makeToOrder Value", this.state.makeToOrder);
  };
  disableFormElements = () => {
    this.setState({ disableFormElements: true });
  };

  enableFormElements = () => {
    this.setState({ disableFormElements: false });
  };
  deleteCustomer = () => {
    fetch(API_URL + "/deleteCustomer/" + this.state.id, {
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
    const customer = {
      nicNumber: this.state.nicNumber,
      customerName: this.state.customerName,
      addressLine1: this.state.addressLine1,
      addressLine2: this.state.addressLine2,
      addressLine3: this.state.addressLine3,
      mobileNumer: this.state.mobileNumer,
      homePhone: this.state.homePhone,
      creditLimit: this.state.creditLimit,
      imageUrl: this.state.imageUrl
    };
    let requestMethod = this.state.saveMode === "Update" ? "PUT" : "POST";
    fetch(
      API_URL +
        (this.state.saveMode === "Update"
          ? "/saveCustomer/" + this.state.id
          : "/saveCustomer"),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("access_token")
        },
        method: requestMethod,
        body: JSON.stringify(customer)
      }
    )
      .then(response => {
        if (response.status === 201 || response.status === 200) {
          this.disableFormElements();
          this.props.reloadFunction();
          this.props.showNotification("Saved Successfully", "success");
          this.props.getCustomerByLocation(response.headers.get("Location"));
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
  uploadFile = () => {
    console.log("File Upload Finction call");
    let file = document.getElementById("customerImage").files[0];
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
              <h2>Customer Name</h2>
              <TextValidator
                disabled={this.state.disableFormElements}
                name="customerName"
                validators={["required"]}
                errorMessages={["Customer Name Required"]}
                value={this.state.customerName}
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
                label="NIC Number"
                disabled={this.state.disableFormElements}
                name="nicNumber"
                validators={["required"]}
                errorMessages={["NIC Number Required"]}
                value={this.state.nicNumber}
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
                label="Address Line1"
                disabled={this.state.disableFormElements}
                name="addressLine1"
                validators={["required"]}
                errorMessages={["AddressLine1 Required"]}
                value={this.state.addressLine1}
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
                label="Address Line2"
                disabled={this.state.disableFormElements}
                name="addressLine2"
                validators={["required"]}
                errorMessages={["AddressLine2 Required"]}
                value={this.state.addressLine2}
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
                label="Address Line3"
                disabled={this.state.disableFormElements}
                name="addressLine3"
                validators={["required"]}
                errorMessages={["AddressLine3 Required"]}
                value={this.state.addressLine3}
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
                label="Mobile Numer"
                disabled={this.state.disableFormElements}
                name="mobileNumer"
                validators={["required"]}
                errorMessages={["Mobile Numer Required"]}
                value={this.state.mobileNumer}
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
                label="Home Phone"
                disabled={this.state.disableFormElements}
                name="homePhone"
                validators={["required"]}
                errorMessages={["Home Phone Required"]}
                value={this.state.homePhone}
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
                type="number"
                name="creditLimit"
                validators={["required"]}
                errorMessages={["Credit Limit Required"]}
                value={this.state.creditLimit}
                onChange={this.handleChange}
                label="Credit Limit"
                margin="dense"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
            <br />
          </GridItem>
          <GridItem>
            <div style={imageContainer}>
              <div>
                {this.state.imageUrl === "" ? (
                  <Camera style={imageViewer} />
                ) : (
                  <img style={imageViewer} src={this.state.imageUrl} />
                )}
              </div>
            </div>
            <br />
            <FormControl className={classes.formControl}>
              <input
                disabled={this.state.disableFormElements}
                accept="image/*"
                type="file"
                onChange={() => this.uploadFile()}
                id="customerImage"
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

export default withStyles(customInputStyle)(CustomerForm);
