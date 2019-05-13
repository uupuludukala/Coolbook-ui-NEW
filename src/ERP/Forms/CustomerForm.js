import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
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

class CustomerForm extends React.Component {
  state = {
    ...this.props.formData,
    mode: this.props.mode
  };

  handleChangeByName = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  clearForm = () => {
    this.clearerrorMessages();
    this.setState({
      nicNumber: "",
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      mobileNumer: "",
      homePhone: "",
      creditLimit: 0
    });
  };
  clearerrorMessages = () => {
    this.setState({
      nicNumberError: "",
      nicNumberHelperText: "",
      firstNameError: "",
      firstNameHelperText: "",
      lastNameError: "",
      lastNameHelperText: "",
      addressLine1Error: "",
      addressLine1HelperText: "",
      addressLine2Error: "",
      addressLine2HelperText: "",
      addressLine3Error: "",
      addressLine3HelperText: "",
      mobileNumerError: "",
      mobileNumerHelperText: "",
      homePhoneError: "",
      homePhoneHelperText: "",
      creditLimitError: "",
      creditLimitHelperText: ""
    });
  };
  submitform = () => {
    if (this.validateForm()) {
      const customer = {
        nicNumber: this.state.nicNumber,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        addressLine1: this.state.addressLine1,
        addressLine2: this.state.addressLine2,
        addressLine3: this.state.addressLine3,
        mobileNumer: this.state.mobileNumer,
        homePhone: this.state.homePhone,
        creditLimit: this.state.creditLimit
      };
      let requestMethod = this.state.mode === "Update" ? "PUT" : "POST";
      fetch(
        API_URL +
          (this.state.mode === "Update"
            ? "/saveCustomer/" + this.state.id
            : "/saveCustomer"),
        {
          headers: { "Content-Type": "application/json" },
          method: requestMethod,
          body: JSON.stringify(customer)
        }
      )
        .then(response => {
          if (response.status === 201 || response.status === 200) {
            this.closeForm();
            this.props.getDataFunction(0);
            // this.clearForm();
          } else if(response.status === 422){
                        
          }else{
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
    if (this.state.nicNumber === "") {
      this.setState({
        nicNumberError: true,
        nicNumberHelperText: "NIC Number Required"
      });
      isValid = false;
    } else {
      this.setState({
        nicNumberError: false,
        nicNumberHelperText: ""
      });
    }
    if (this.state.firstName === "") {
      this.setState({
        firstNameError: true,
        firstNameHelperText: "First Name Required"
      });
      isValid = false;
    } else {
      this.setState({
        firstNameError: false,
        firstNameHelperText: ""
      });
    }
    if (this.state.lastName === "") {
      this.setState({
        lastNameError: true,
        lastNameHelperText: "Last Name Required"
      });
      isValid = false;
    } else {
      this.setState({
        lastNameError: false,
        lastNameHelperText: ""
      });
    }
    if (this.state.addressLine1 === "") {
      this.setState({
        addressLine1Error: true,
        addressLine1HelperText: "AddressLine1 Required"
      });
      isValid = false;
    } else {
      this.setState({
        addressLine1Error: false,
        addressLine1HelperText: ""
      });
    }
    if (this.state.addressLine2 === "") {
      this.setState({
        addressLine2Error: true,
        addressLine2HelperText: "AddressLine2 Required"
      });
      isValid = false;
    } else {
      this.setState({
        addressLine2Error: false,
        addressLine2HelperText: ""
      });
    }
    if (this.state.mobileNumer === "") {
      this.setState({
        mobileNumerError: true,
        mobileNumerHelperText: "Mobile Numer Required"
      });
      isValid = false;
    } else {
      this.setState({
        mobileNumerError: false,
        mobileNumerHelperText: ""
      });
    }

    if (this.state.creditLimit === "") {
      this.setState({
        creditLimitError: true,
        creditLimitHelperText: "CreditLimit Required"
      });
      isValid = false;
    } else {
      this.setState({
        creditLimitError: false,
        creditLimitHelperText: ""
      });
    }
    return isValid;
  };
  render() {
    const { classes } = this.props;

    return (
      <div>
        <form autoComplete="off">
          <FormControl className={classes.formControl}>
            <TextField
              required={true}
              name="nicNumber"
              value={this.state.nicNumber}
              onChange={this.handleChange}
              label="NIC Number"
              error={this.state.nicNumberError}
              helperText={this.state.nicNumberHelperText}
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
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleChange}
              label="First Name"
              error={this.state.firstNameError}
              helperText={this.state.firstNameHelperText}
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
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleChange}
              label="Last Name"
              error={this.state.lastNameError}
              helperText={this.state.lastNameHelperText}
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
              name="addressLine1"
              value={this.state.addressLine1}
              onChange={this.handleChange}
              label="AddressLine1"
              error={this.state.addressLine1Error}
              helperText={this.state.addressLine1HelperText}
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
              name="addressLine2"
              value={this.state.addressLine2}
              onChange={this.handleChange}
              label="AddressLine2"
              error={this.state.addressLine2Error}
              helperText={this.state.addressLine2HelperText}
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <TextField
              required={false}
              name="addressLine3"
              value={this.state.addressLine3}
              onChange={this.handleChange}
              label="AddressLine3"
              error={this.state.addressLine3Error}
              helperText={this.state.addressLine3HelperText}
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
              error={this.state.mobileNumerError}
              helperText={this.state.mobileNumerHelperText}
              name="mobileNumer"
              value={this.state.mobileNumer}
              onChange={this.handleChange}
              label="Mobile Numer"
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <br />

          <FormControl className={classes.formControl}>
            <TextField
              required={false}
              error={this.state.homePhoneError}
              helperText={this.state.homePhoneHelperText}
              name="homePhone"
              value={this.state.homePhone}
              onChange={this.handleChange}
              label="Home Phone"
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
              error={this.state.creditLimitError}
              helperText={this.state.creditLimitHelperText}
              type="number"
              name="creditLimit"
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

CustomerForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomerForm);
