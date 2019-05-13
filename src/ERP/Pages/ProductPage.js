import React from "react";
import DataGrid from "../Components/DataGrid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import ProductForm from "../Forms/ProductForm";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import { API_URL } from "../properties/applicationProperties";
import Switch from "@material-ui/core/Switch";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

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
    const product = {
      active: false,
      barcode: "",
      cost: 0,
      productCategory: "#",
      productCode: "",
      productName: "",
      productType: "0",
      quantity: 0,
      salePrice: 0
    };
    super(props);
    this.state = {
      data: [],
      isOpen: false,
      mode: "",
      formData: product,
      product: product,
      page: 0,
      isDltOpen: false,
      active: false,
      barcode: "",
      productCategory: "#",
      productCode: "",
      productName: "",
      productType: "",
      productCategoryList: []
    };
  }
  getProductCategory = () => {
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

  handleChangeByName = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getProduct = page => {
    let searchParameters = this.getSearchParameters(page);
    console.log("searchParameters", searchParameters);
    fetch(API_URL + "/getAllProduct?" + searchParameters)
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        if (dataRetrived.page.totalPages !== 0) {
          const rawData = dataRetrived._embedded.productGetList;
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
      "&productCategory=" +
      this.state.productCategory +
      "&productCode=" +
      this.state.productCode +
      "&productName=" +
      this.state.productName +
      "&productType=" +
      this.state.productType;
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

  deleteProduct = () => {
    fetch(API_URL + "/deleteProduct/" + this.state.deleteItemId, {
      headers: { "Content-Type": "application/json" },
      method: "DELETE"
    })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            isDltOpen: false
          });
          this.getProduct(0);
        } else {
          console.log("Error Saving Data");
        }
      })
      .catch(error => {
        console.log("error Saving Data catch" + error);
      });
  };
  componentDidMount() {
    this.getProductCategory();
    this.getProduct(0);
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
    if (mode === "Add") this.setState({ formData: this.state.product });
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
        id: "productCode",
        numeric: false,
        disablePadding: true,
        label: "Product Code"
      },
      {
        id: "productName",
        numeric: false,
        disablePadding: true,
        label: "Product Name"
      },
      {
        id: "productType",
        numeric: false,
        disablePadding: true,
        label: "Product Type"
      },
      {
        id: "productCategory",
        numeric: false,
        disablePadding: true,
        label: "Product Category"
      },
      { id: "barcode", numeric: false, disablePadding: true, label: "Barcode" },
      {
        id: "salePrice",
        numeric: true,
        disablePadding: false,
        label: "Sale Price"
      },
      { id: "cost", numeric: true, disablePadding: false, label: "Cost" },
      { id: "active", numeric: false, disablePadding: true, label: "Active" },
      {
        id: "quantity",
        numeric: true,
        disablePadding: false,
        label: "Quantity"
      },
      { id: "Image", numeric: false, disablePadding: true, label: "Image" }
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
          <FormControl className={classes.formControl}>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.active}
                  name="active"
                  onChange={this.handleChangeByName("active")}
                  label="Active"
                  color="primary"
                >
                  {" "}
                </Switch>
              }
              label="Active"
            />
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <TextField
              required={true}
              name="barcode"
              value={this.state.barcode}
              onChange={this.handleChange}
              label="Barcode"
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>

          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="productCategory">Product Category</InputLabel>
            <Select
              value={this.state.productCategory}
              native
              onChange={this.handleChange}
              input={<Input name="productCategory" id="productCategory" />}
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
              name="productCode"
              value={this.state.productCode}
              onChange={this.handleChange}
              label="Product Code"
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              required={true}
              name="productName"
              value={this.state.productName}
              onChange={this.handleChange}
              label="Product Name"
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="productType">Product Type</InputLabel>
            <Select
              value={this.state.productType}
              onChange={this.handleChange}
              input={<Input name="productType" id="productType" />}
            >
              <MenuItem value="0">
                <em>None</em>
              </MenuItem>
              <MenuItem value="olivier">Olivier</MenuItem>
              <MenuItem value="kevin">Kevin</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={() => this.getProduct(0)}
          >
            Search
          </Button>
        </form>
        {/* this.state.data.length > 0 && */}
        {
          <DataGrid
            deleteFunction={this.deleteDialogOpen}
            getDataFunction={this.getProduct}
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
            <ProductForm
              getDataFunction={this.getProduct}
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
              onClick={this.deleteProduct}
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
