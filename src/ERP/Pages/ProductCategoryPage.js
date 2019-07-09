import React from "react";
import DataGrid from "../Components/DataGrid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import { API_URL } from "../properties/applicationProperties";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import { withStyles } from "@material-ui/core/styles";
import ProductCategoryForm from "../Forms/ProductCategoryForm";
import "../css/main.css";

import MenuItem from "@material-ui/core/MenuItem";
const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  }
});

class ProductPage extends React.Component {
  constructor(props) {
    const productCategory = {
      parentCategory: 0,
      parentCategoryCode: "",
      productCatCode: "",
      productCatName: "",
      id: 0
    };
    super(props);
    this.state = {
      parentCategory: 0,
      data: [],
      isOpen: false,
      mode: "",
      formData: productCategory,
      productCategory: productCategory,
      page: 0,
      isDltOpen: false,
      productCatCode: "",
      productCatName: "",
      productCategoryList: []
    };
  }

  handleChangeByName = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getProductCategory = page => {
    let searchParameters = this.getSearchParameters(page);
    console.log("searchParameters", searchParameters);
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
    let parentCatPram = "";
    if (this.state.parentCategory != 0)
      parentCatPram = "&parentCategory=" + this.state.parentCategory;
    var parameterString =
      "page=" +
      page +
      parentCatPram +
      "&productCatCode=" +
      this.state.productCatCode +
      "&productCatName=" +
      this.state.productCatName;
    return parameterString;
  };

  deleteDialogOpen = id => {
    console.log("Id is", id);
    this.setState({
      isDltOpen: true,
      deleteItemId: id
    });
  };

  deleteProductCategory = () => {
    fetch(API_URL + "/deleteProductCategory/" + this.state.deleteItemId, {
      headers: { "Content-Type": "application/json" },
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            isDltOpen: false
          });
          this.getProductCategory(0);
          this.getProductCategoryList();
        } else {
          console.log("Error Saving Data");
        }
      })
      .catch(error => {
        console.log("error Saving Data catch" + error);
      });
  };
  componentDidMount() {
    this.getProductCategoryList();
    this.getProductCategory(0);
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
    console.log("this.state.productCategory", this.state.productCategory);
    if (mode === "Add") this.setState({ formData: this.state.productCategory });
    this.setState({
      isOpen: true,
      mode: mode
    });
  };

  getProductCategoryList = () => {
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

  rowSelect = selectedRow => {
    this.setState({
      formData: selectedRow
    });
  };
  render() {
    const { classes } = this.props;
    const rows = [
      {
        id: "parentCategory",
        numeric: false,
        disablePadding: true,
        label: "Parent Category Id",
        display: true
      },
      {
        id: "parentCategoryCode",
        numeric: false,
        disablePadding: true,
        label: "Parent Category Code",
        display: true
      },
      {
        id: "productCatCode",
        numeric: false,
        disablePadding: true,
        label: "Product Category  Code",
        display: true
      },
      {
        id: "productCatName",
        numeric: false,
        disablePadding: true,
        label: "Product Category Name",
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
          <FormControl required className="formControl">
            <InputLabel htmlFor="parentCategory">Parent Category</InputLabel>
            <Select
              value={this.state.parentCategory}
              onChange={this.handleChange}
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
            </Select>
          </FormControl>
          <div className="searchFormFieldSeperator" />
          <FormControl className="formControl">
            <TextField
              required={true}
              name="productCatCode"
              value={this.state.productCatCode}
              onChange={this.handleChange}
              label="Product Category Code"
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
              name="productCatName"
              value={this.state.productCatName}
              onChange={this.handleChange}
              label="Product Category Name"
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
            onClick={() => this.getProductCategory(0)}
          >
            Search
          </Button>
        </div>
        {/* this.state.data.length > 0 && */}
        {
          <DataGrid
            deleteFunction={this.deleteDialogOpen}
            getDataFunction={this.getProductCategory}
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
            {this.state.mode} Product Category
          </DialogTitle>
          <DialogContent>
            <ProductCategoryForm
              getProductCategoryListFucntion={this.getProductCategoryList}
              getDataFunction={this.getProductCategory}
              closefunction={this.handleFormClose}
              formData={this.state.formData}
              mode={this.state.mode}
              productCategoryList={this.state.productCategoryList}
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
          <DialogTitle>Delete Product</DialogTitle>
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
              onClick={this.deleteProductCategory}
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
export default withStyles(styles)(ProductPage);
