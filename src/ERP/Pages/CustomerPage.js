import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import Table from "components/Table/Table.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CustomerForm from "../Forms/CustomerForm";
import MasterDataToolbar from "components/ToolBar/MasterDataToolbar.jsx";
import { API_URL } from "../properties/applicationProperties";
import Snackbar from "components/Snackbar/Snackbar.jsx";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  }
});

class CustomerPage extends React.Component {
  state = {
    pageSize: 20,
    data: [],
    customer: "",
    isOpenNotification: false
  };

  closeNotification = () => {
    console.log("Notification Function");
    this.setState({
      isOpenNotification: false
    });
  };

  reloadData = () => {
    this.getCustomer(0, this.state.pageSize);
  };
  showNotification = (message, notificationclass) => {
    this.setState({
      isOpenNotification: true,
      notificationMessage: message,
      notificationclass: notificationclass
    });
  };

  componentDidMount() {
    this.reloadData();
  }
  getSearchParameters = (page, pageSize) => {
    var parameterString = "page=" + page + "&size=" + pageSize;
    return parameterString;
  };

  getCustomer = (page, pageSize) => {
    console.log("Function called Today");
    this.setState({ pageSize: pageSize });
    let searchParameters = this.getSearchParameters(page, pageSize);

    fetch(API_URL + "/getAllCustomer?" + searchParameters, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        if (dataRetrived.page.totalPages !== 0) {
          const rawData = dataRetrived._embedded.customerGetList;
          this.setState({
            data: rawData
          });
        } else {
          this.setState({
            data: []
          });
        }
        this.setState({
          pageSize: dataRetrived.page.size,
          totalPages: dataRetrived.page.totalPages,
          rowsCount: dataRetrived.page.totalElements,
          page: dataRetrived.page.number
        });
        this.refs.toolBar.renderGrid();
      })
      .catch(err => {
        // Do something for an error here
        console.log("Error", err);
      });
  };

  submitForm = () => {
    this.refs.customerForm.submitform();
  };

  deleteSelected = () => {
    this.refs.customerForm.deleteCustomer();
  };
  enableEditMode = () => {
    this.refs.customerForm.enableEditMode();
    this.refs.customerForm.enableFormElements();
  };

  enableAddMode = () => {
    this.refs.customerForm.enableAddMode();
    this.refs.customerForm.clearForm();
    this.refs.customerForm.enableFormElements();
  };
  resetForm = () => {
    this.refs.customerForm.resetForm();
  };
  getSelectedCustomer = id => {
    fetch(API_URL + "/getCustomerById/" + id, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        this.refs.toolBar.renderForm();
        this.refs.customerForm.setFormData(dataRetrived);
      })
      .catch(err => {
        console.log("Error", err);
      });
  };
  getCustomerByLocation = location => {
    fetch(location, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        this.refs.toolBar.renderForm();
        this.refs.customerForm.setFormData(dataRetrived);
      })
      .catch(err => {
        console.log("Error", err);
      });
  };
  disableSaveButtons = () => {
    this.refs.toolBar.disableSaveButtons();
  };

  render() {
    const tableHeaders = [
      {
        id: "customerName",
        numeric: false,
        label: "Customer Name"
      },
      {
        id: "addressLine1",
        numeric: false,
        label: "Address Line1"
      },
      {
        id: "addressLine2",
        numeric: true,
        label: "Address Line2"
      },
      {
        id: "addressLine3",
        numeric: true,
        label: "Address Line3"
      },
      {
        id: "mobileNumer",
        numeric: true,
        label: "Mobile Numer"
      }
    ];

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <MasterDataToolbar
              ref="toolBar"
              submitForm={this.submitForm}
              deleteSelected={this.deleteSelected}
              resetForm={this.resetForm}
              enableEditModeFuction={this.enableEditMode}
              enableAddModeFuction={this.enableAddMode}
              reloadFunction={this.reloadData}
            />

            <CardBody id="main">
              <Table
                rowsPerPageOptions={[5, 10, 20, 25, 50, 100]}
                rowsCount={this.state.rowsCount}
                rowsPerPage={this.state.pageSize}
                page={this.state.page}
                tableHeaderColor="primary"
                tableHead={tableHeaders}
                tableData={this.state.data}
                getDataFunction={this.getCustomer}
                getSelectedRowFuction={this.getSelectedCustomer}
              />
            </CardBody>
            <CardBody id="form" style={{ display: "none" }}>
              <CustomerForm
                ref="customerForm"
                reloadFunction={this.reloadData}
                showNotification={this.showNotification}
                getCustomerByLocation={this.getCustomerByLocation}
                disableSaveButtons={this.disableSaveButtons}
              />
            </CardBody>
          </Card>
        </GridItem>

        <Snackbar
          place="tl"
          color={this.state.notificationclass}
          message={this.state.notificationMessage}
          onClose={this.closeNotification}
          open={this.state.isOpenNotification}
          closeNotification={this.closeNotification}
          close
        />
      </GridContainer>
    );
  }
}
export default withStyles(styles)(CustomerPage);
