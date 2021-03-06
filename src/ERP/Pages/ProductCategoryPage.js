import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import Table from "components/Table/Table.jsx";
import CardBody from "components/Card/CardBody.jsx";
import ProductCategoryForm from "../Forms/ProductCategoryForm";
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

class ProductCategoryPage extends React.Component {
  state = {
    searchDialogOpen: false,
    pageSize: 20,
    data: [],
    product: "",
    isOpenNotification: false,
    searchFields: [
      {
        name: "productCatCode",
        type: "Text",
        label: "Product Category Code",
        data: []
      },
      {
        name: "productCatName",
        type: "Text",
        label: "Product Category Name",
        data: []
      }
    ]
  };

  openSearchDialog = () => {
    console.log("searchDialogOpen called");
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
    this.getProductCategory(0, this.state.pageSize,"");
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

  getProductCategory = (page, pageSize,searchValue) => {
    this.setState({ pageSize: pageSize });
    let searchParameters = this.getSearchParameters(page, pageSize)+searchValue;

    fetch(API_URL + "/getAllProductCategory?" + searchParameters, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        if (dataRetrived.page.totalPages !== 0) {
          const rawData = dataRetrived._embedded.productCategoryGetList;
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
    this.refs.productForm.submitform();
  };

  deleteSelected = () => {
    this.refs.productForm.deleteProductCategory();
  };
  enableEditMode = () => {
    this.refs.productForm.enableEditMode();
    this.refs.productForm.enableFormElements();
  };

  enableAddMode = () => {
    this.refs.productForm.enableAddMode();
    this.refs.productForm.clearForm();
    this.refs.productForm.enableFormElements();
  };
  resetForm = () => {
    this.refs.productForm.resetForm();
  };
  getSelectedProductCategory = id => {
    fetch(API_URL + "/getProductCategoryById/" + id, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        this.refs.toolBar.renderForm();
        this.refs.productForm.setFormData(dataRetrived);
      })
      .catch(err => {
        console.log("Error", err);
      });
  };
  getProductCategoryByLocation = location => {
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
        this.refs.productForm.setFormData(dataRetrived);
      })
      .catch(err => {
        console.log("Error", err);
      });
  };
  disableSaveButtons = () => {
    this.refs.toolBar.disableSaveButtons();
  };
  getQueryParameter = searchValue => {
    this.getProductCategory(0, this.state.pageSize, searchValue);
  };
  render() {
    const tableHeaders = [
      {
        id: "parentCategoryCode",
        numeric: false,
        label: "Parent Category"
      },
      {
        id: "productCatCode",
        numeric: false,
        label: "Category Code"
      },
      {
        id: "productCatName",
        numeric: true,
        label: "Category Name"
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
                getDataFunction={this.getProductCategory}
                getSelectedRowFuction={this.getSelectedProductCategory}
              />
            </CardBody>
            <CardBody id="form" style={{ display: "none" }}>
              <ProductCategoryForm
                ref="productForm"
                reloadFunction={this.reloadData}
                showNotification={this.showNotification}
                getProductCategoryByLocation={this.getProductCategoryByLocation}
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
          <DialogTitle id="form-dialog-title">Search Product Category</DialogTitle>
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
export default withStyles(styles)(ProductCategoryPage);
