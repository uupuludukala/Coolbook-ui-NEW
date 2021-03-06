import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import Table from "components/Table/Table.jsx";
import CardBody from "components/Card/CardBody.jsx";
import UserForm from "../Forms/UserForm";
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

class UserPage extends React.Component {
  state = {
    searchDialogOpen: false,
    pageSize: 20,
    data: [],
    user: "",
    isOpenNotification: false,
    searchFields: [
      {
        name: "userName",
        type: "Text",
        label: "User Name",
        data: []
      }
    ]
  };

  openSearchDialog = () => {
    this.setState({ searchDialogOpen: true });
  };

  closeNotification = () => {
    this.setState({
      isOpenNotification: false
    });
  };
  getQueryParameter = searchValue => {
    this.getUser(0, this.state.pageSize, searchValue);
  };
  handleSearchDialogClose = () => {
    this.setState({ searchDialogOpen: false });
  };
  
  reloadData = () => {
    this.getUser(0, this.state.pageSize,"");
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

  getUser = (page, pageSize,searchValue) => {
    this.setState({ pageSize: pageSize });
    let searchParameters = this.getSearchParameters(page, pageSize)+searchValue;

    fetch(API_URL + "/getAllUser?" + searchParameters, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        if (dataRetrived.page.totalPages !== 0) {
          const rawData = dataRetrived._embedded.userGetList;
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
        console.log("Error", err);
      });
  };

  submitForm = () => {
    this.refs.userForm.submitform();
  };

  deleteSelected = () => {
    this.refs.userForm.deleteUser();
  };
  enableEditMode = () => {
    this.refs.userForm.enableEditMode();
    this.refs.userForm.enableFormElements();
  };

  enableAddMode = () => {
    this.refs.userForm.enableAddMode();
    this.refs.userForm.clearForm();
    this.refs.userForm.enableFormElements();
  };
  resetForm = () => {
    this.refs.userForm.resetForm();
  };
  getSelectedUser = id => {
    fetch(API_URL + "/getUserById/" + id, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        this.refs.toolBar.renderForm();
        this.refs.userForm.setFormData(dataRetrived);
      })
      .catch(err => {
        console.log("Error", err);
      });
  };
  getUserByLocation = location => {
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
        this.refs.userForm.setFormData(dataRetrived);
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
        id: "userName",
        numeric: false,
        label: "User Name"
      },
      {
        id: "branch",
        numeric: true,
        label: "Branch"
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
                getDataFunction={this.getUser}
                getSelectedRowFuction={this.getSelectedUser}
              />
            </CardBody>
            <CardBody id="form" style={{ display: "none" }}>
              <UserForm
                ref="userForm"
                reloadFunction={this.reloadData}
                showNotification={this.showNotification}
                getUserByLocation={this.getUserByLocation}
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
          <DialogTitle id="form-dialog-title">Search User</DialogTitle>
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
export default withStyles(styles)(UserPage);
