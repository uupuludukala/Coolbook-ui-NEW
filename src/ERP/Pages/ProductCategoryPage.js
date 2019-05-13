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

class ProductPage extends React.Component {
  constructor(props) {
    const productCategory = {
      parentCategory: 0,
      productCatCode: "",
      productCatName: ""
    };
    super(props);
    this.state = {
      data: [],
      isOpen: false,
      mode: "",
      formData: productCategory,
      productCategory: productCategory,
      page: 0,
      isDltOpen: false,
      parentCategory: 0,
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
    fetch(API_URL + "/getAllProductCategory?" + searchParameters)
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
    var parameterString =
      "page=" +
      page +
      "&barcode=" +
      this.state.barcode +
      "&parentCategory=" +
      this.state.parentCategory +
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
      method: "DELETE"
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
    if (mode === "Add") this.setState({ formData: this.state.productCategory });
    this.setState({
      isOpen: true,
      mode: mode
    });
  };

  getProductCategoryList = () => {
    fetch(API_URL + "/getAllProductCategory")
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
    console.log("Forma Data", this.state.formData);
  };
  render() {
    const { classes } = this.props;
    const rows = [
      {
        id: "parentCategory",
        numeric: false,
        disablePadding: true,
        label: "Parent Category Id"
      },
      {
        id: "parentCategoryCode",
        numeric: false,
        disablePadding: true,
        label: "Parent Category Code"
      },
      {
        id: "productCatCode",
        numeric: false,
        disablePadding: true,
        label: "Product Category  Code"
      },
      {
        id: "productCatName",
        numeric: false,
        disablePadding: true,
        label: "Product Category Name"
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
        <form autoComplete="off">
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="parentCategory">Parent Category</InputLabel>
            <Select
              value={this.state.parentCategory}
              native
              onChange={this.handleChange}
              input={<Input name="parentCategory" id="parentCategory" />}
            >
              {this.state.productCategoryList.map(
                n => (
                  <option value={n.id}>{n.productCatCode}</option>
                ),
                this
              )}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
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

          <FormControl className={classes.formControl}>
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

          <Button
            variant="contained"
            color="primary"
            onClick={() => this.getProductCategory(0)}
          >
            Search
          </Button>
        </form>
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
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">
            {this.state.mode} Product
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
