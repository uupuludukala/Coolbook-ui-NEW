import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import Table from "components/Table/Table.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CompanyForm from "../Forms/CompanyForm";
import MasterDataToolbar from "components/ToolBar/MasterDataToolbar.jsx";
import { API_URL } from "../properties/applicationProperties";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import SearchBar from "components/SearchBar/SearchBar.jsx";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  }
});

class CompanyPage extends React.Component {
  state = {
    searchDialogOpen: false,
    pageSize: 20,
    data: [],
    isOpenNotification: false,
    searchFields: [
      {
        name: "companyName",
        type: "Text",
        label: "Company Name",
        data: []
      },
      {
        name: "contactNumber",
        type: "Text",
        label: "Contact Number",
        data: []
      }
    ]
  };

  openSearchDialog = () => {
    this.setState({ searchDialogOpen: true });
  };
  handleSearchDialogClose = () => {
    this.setState({ searchDialogOpen: false });
  };
  closeNotification = () => {
    console.log("Notification Function");
    this.setState({
      isOpenNotification: false
    });
  };

  reloadData = () => {
    this.getCompany(0, this.state.pageSize, "");
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

  getCompany = (page, pageSize, searchValue) => {
    this.setState({ pageSize: pageSize });
    let searchParameters =
      this.getSearchParameters(page, pageSize) + searchValue;
    fetch(API_URL + "/getAllCompany?" + searchParameters, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        if (dataRetrived.page.totalPages !== 0) {
          const rawData = dataRetrived._embedded.companyGetList;
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
    this.refs.companyForm.submitform();
  };

  deleteSelected = () => {
    this.refs.companyForm.deleteCompany();
  };
  enableEditMode = () => {
    this.refs.companyForm.enableEditMode();
    this.refs.companyForm.enableFormElements();
  };

  enableAddMode = () => {
    this.refs.companyForm.enableAddMode();
    this.refs.companyForm.clearForm();
    this.refs.companyForm.enableFormElements();
  };
  resetForm = () => {
    this.refs.companyForm.resetForm();
  };
  getSelectedCompany = id => {
    fetch(API_URL + "/getCompanyById/" + id, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        this.refs.toolBar.renderForm();
        this.refs.companyForm.setFormData(dataRetrived);
      })
      .catch(err => {
        console.log("Error", err);
      });
  };
  getCompanyByLocation = location => {
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
        this.refs.companyForm.setFormData(dataRetrived);
      })
      .catch(err => {
        console.log("Error", err);
      });
  };
  disableSaveButtons = () => {
    this.refs.toolBar.disableSaveButtons();
  };
  getQueryParameter = searchValue => {
    this.getCompany(0, this.state.pageSize, searchValue);
  };
  render() {
    const tableHeaders = [
      {
        id: "companyCode",
        numeric: false,
        label: "Company Code"
      },
      {
        id: "companyName",
        numeric: false,
        label: "Company Name"
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
        id: "contactNumber",
        numeric: true,
        label: "Contact Number"
      }
    ];

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <MasterDataToolbar
              openSearchDialog={this.openSearchDialog}
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
                getDataFunction={this.getCompany}
                getSelectedRowFuction={this.getSelectedCompany}
              />
            </CardBody>
            <CardBody id="form" style={{ display: "none" }}>
              <CompanyForm
                ref="companyForm"
                reloadFunction={this.reloadData}
                showNotification={this.showNotification}
                getCompanyByLocation={this.getCompanyByLocation}
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
        <Dialog
          open={this.state.searchDialogOpen}
          onClose={this.handleSearchDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Search Company</DialogTitle>
          <DialogContent>
            <SearchBar
              searchDialogCloseFunction={this.handleSearchDialogClose}
              searchFields={this.state.searchFields}
              getQueryParameter={this.getQueryParameter}
            />
          </DialogContent>
        </Dialog>
      </GridContainer>
    );
  }
}
export default withStyles(styles)(CompanyPage);
