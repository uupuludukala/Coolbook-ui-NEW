import React from "react";
import DataGrid from "../Components/DataGrid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CustomerForm from "../Forms/CustomerForm";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import { API_URL } from "../properties/applicationProperties";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import "../css/main.css";
const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  }
});

class CustomerPage extends React.Component {
  constructor(props) {
    const customer = {
      nicNumber: "",
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      mobileNumer: "",
      homePhone: "",
      creditLimit: 0
    };
    super(props);
    this.state = {
      data: [],
      isOpen: false,
      mode: "",
      formData: customer,
      customer: customer,
      page: 0,
      isDltOpen: false,
      nicNumber: "",
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      mobileNumer: "",
      homePhone: "",
      creditLimit: 0
    };
  }

  handleChangeByName = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getCustomer = page => {
    let searchParameters = this.getSearchParameters(page);
    console.log("searchParameters", searchParameters);
    fetch(API_URL + "/getAllCustomer?" + searchParameters)
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        if (dataRetrived.page.totalPages !== 0) {
          const rawData = dataRetrived._embedded.customerGetList;
          this.setState({
            data: rawData,
            pageSize: dataRetrived.page.size,
            totalPages: dataRetrived.page.totalPages,
            totalElements: dataRetrived.page.totalElements,
            page: dataRetrived.page.number
          });
        } else {
          this.setState({
            data: [],
            pageSize: dataRetrived.page.size,
            totalPages: dataRetrived.page.totalPages,
            totalElements: dataRetrived.page.totalElements,
            page: dataRetrived.page.number
          });
        }
      })
      .catch(err => {
        // Do something for an error here
        console.log("Error", err);
      });
  };

  getSearchParameters = page => {
    var parameterString =
      "page=" +
      page +
      "&barcode=" +
      this.state.barcode +
      "&nicNumber=" +
      this.state.nicNumber +
      "&firstName=" +
      this.state.firstName +
      "&mobileNumer=" +
      this.state.mobileNumer;
    console.log("parameterString", parameterString);
    return parameterString;
  };

  deleteDialogOpen = id => {
    console.log("Id is", id);
    this.setState({
      isDltOpen: true,
      deleteItemId: id
    });
  };

  deleteCustomer = () => {
    fetch(API_URL + "/deleteCustomer/" + this.state.deleteItemId, {
      headers: { "Content-Type": "application/json" },
      method: "DELETE"
    })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            isDltOpen: false
          });
          this.getCustomer(0);
        } else {
          console.log("Error Saving Data");
        }
      })
      .catch(error => {
        console.log("error Saving Data catch" + error);
      });
  };
  componentDidMount() {
    this.getCustomer(0);
  }

  handleFormClose = () => {
    this.setState({
      isOpen: false
    });
  };

  closeDeleteDialog = () => {
    this.setState({ isDltOpen: false });
  };

  renderForm = mode => {
    if (mode === "Add") this.setState({ formData: this.state.customer });
    this.setState({
      isOpen: true,
      mode: mode
    });
  };

  rowSelect = selectedRow => {
    this.setState({
      formData: selectedRow
    });
    console.log("Forma Data", this.state.formData);
  };
  render() {
    const { classes } = this.props;
    const rows = [
      {
        id: "nicNumber",
        numeric: false,
        disablePadding: true,
        label: "NIC Number",
        display: true
      },
      {
        id: "firstName",
        numeric: false,
        disablePadding: true,
        label: "First Name",
        display: true
      },
      {
        id: "lastName",
        numeric: false,
        disablePadding: true,
        label: "Last Name",
        display: true
      },
      {
        id: "addressLine1",
        numeric: false,
        disablePadding: true,
        label: "Address Line1",
        display: true
      },
      {
        id: "addressLine2",
        numeric: false,
        disablePadding: true,
        label: "Address Line2",
        display: true
      },
      {
        id: "addressLine3",
        numeric: false,
        disablePadding: true,
        label: "Address Line3",
        display: true
      },
      {
        id: "mobileNumer",
        numeric: false,
        disablePadding: true,
        label: "Mobile Numer",
        display: true
      },
      {
        id: "homePhone",
        numeric: true,
        disablePadding: false,
        label: "Home Phone",
        display: true
      },
      {
        id: "creditLimit",
        numeric: true,
        disablePadding: false,
        label: "Credit Limit",
        display: true
      }
    ];
    return (
      <div>
        <Fab
          color="primary"
          aria-label="Add"
          onClick={() => this.renderForm("Add")}
        >
          <AddIcon />
        </Fab>
        <div className="formContainer">
          <FormControl className="formControl">
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
          <div className="searchFormFieldSeperator" />
          <FormControl className="formControl">
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
          <div className="searchFormFieldSeperator" />
          <FormControl className="formControl">
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
          <div className="searchFormFieldSeperator" />
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.getCustomer(0)}
          >
            Search
          </Button>
        </div>
        {/* this.state.data.length > 0 && */}
        {
          <DataGrid
            deleteFunction={this.deleteDialogOpen}
            getDataFunction={this.getCustomer}
            rows={rows}
            data={this.state.data}
            page={this.state.page}
            totalElements={this.state.totalElements}
            totalPages={this.setState.totalPages}
            rowsPerPage={this.state.pageSize}
            rowSelected={this.rowSelect}
            rowOnclickFunction={() => this.renderForm("Update")}
          />
        }
        <Dialog
          fullWidth={true}
          open={this.state.isOpen}
          onClose={this.handleFormClose}
          scroll="paper"
          disableBackdropClick
          disableEscapeKeyDown
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">
            {this.state.mode} Customer
          </DialogTitle>
          <DialogContent>
            <CustomerForm
              getDataFunction={this.getCustomer}
              closefunction={this.handleFormClose}
              formData={this.state.formData}
              mode={this.state.mode}
            />
          </DialogContent>
          {/* <DialogActions>
                        <Button onClick={this.handleFormClose} color="primary">
                            Save
                        </Button>
                        <Button onClick={this.handleFormClose} color="primary">
                            Clear
                        </Button>
                        <Button onClick={this.handleFormClose} color="primary">
                            Cancel
                        </Button>

                    </DialogActions> */}
        </Dialog>
        <Dialog
          open={this.state.isDltOpen}
          onClose={this.closeDeleteDialog}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please confirm to delete record
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.closeDeleteDialog}
              variant="contained"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={this.deleteCustomer}
              variant="contained"
              color="primary"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default withStyles(styles)(CustomerPage);
