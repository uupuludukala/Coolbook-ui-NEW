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
class ProductForm extends React.Component {
  state = {
    imageUrl: "",
    companies: [],
    companyIds: [],
    tabValue: 0,
    productType: 0,
    productCategoryList: [],
    companyList: []
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
  handleChangeForCompany = event => {
    const company = [];
    const companyId = [];

    console.log("event.target.value.length", event.target.value);
    // const hashMap = new NaiveHashMap();
    for (let i = 0, l = event.target.value.length; i < l; i += 1) {
      let isExists = false;
      console.log("event.target.value[i].id", event.target.value[i].id);
      for (let j = 0, k = this.state.companies.length; j < k; j += 1) {
        if (event.target.value[i].id === this.state.companies[j].id) {
          console.log("is exists", this.state.companies[j].id);
          this.state.companies[j] = event.target.value[i];
          isExists = true;
          break;
        }
      }
      // company[i] = event.target.value[i];
      // hashMap.set(event.target.value[i].id, event.target.value[i]);
      console.log("company value", company);
      if (!isExists) {
        console.log("Not Exists", event.target.value[i].id);
        this.state.companies.push(event.target.value[i]);
        companyId.push(event.target.value[i].id);
      }
    }

    // this.setState({ companies: company });
    this.setState({ companyIds: companyId });
    console.log("this.state.companies", this.state.companies);
  };

  componentDidMount() {
    this.getProductCategory();
    this.getCompany();
  }

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
      canBeSold: false,
      canBePurchased: false,
      productName: "",
      productType: "",
      productCategory: 0,
      internalReference: "",
      barcode: "",
      internalNotes: "",
      salePrice: "0.00",
      cost: "0.00",
      active: false,
      quantity: "0.00",
      imageUrl: "",
      availableInPos: false,
      makeToOrder: false,
      customerLeadTime: "0.00",
      descDelOrder: "",
      descReceipt: "",
      weight: "0.00",
      volume: "0.00",
      responsible: 0,
      companies: []
    });
  };

  setFormData = dataRetrived => {
    this.setState({ ...dataRetrived });

    this.disableFormElements();
  };
  disableFormElements = () => {
    this.setState({ disableFormElements: true });
  };

  enableFormElements = () => {
    this.setState({ disableFormElements: false });
  };
  deleteProduct = () => {
    fetch(API_URL + "/deleteProduct/" + this.state.id, {
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
    const product = {
      canBeSold: this.state.canBeSold,
      canBePurchased: this.state.canBePurchased,
      productName: this.state.productName,
      productType: this.state.productType,
      productCategory: this.state.productCategory,
      internalReference: this.state.internalReference,
      barcode: this.state.barcode,
      internalNotes: this.state.internalNotes,
      salePrice: this.state.salePrice,
      cost: this.state.cost,
      active: true,
      quantity: this.state.quantity,
      imageUrl: this.state.imageUrl,
      availableInPos: this.state.availableInPos,
      makeToOrder: this.state.makeToOrder,
      customerLeadTime: this.state.customerLeadTime,
      descDelOrder: this.state.descDelOrder,
      descReceipt: this.state.descReceipt,
      weight: this.state.weight,
      volume: this.state.volume,
      responsible: this.state.responsible,
      companies: this.state.companyIds
    };
    let requestMethod = this.state.saveMode === "Update" ? "PUT" : "POST";
    fetch(
      API_URL +
        (this.state.saveMode === "Update"
          ? "/saveProduct/" + this.state.id
          : "/saveProduct"),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("access_token")
        },
        method: requestMethod,
        body: JSON.stringify(product)
      }
    )
      .then(response => {
        if (response.status === 201 || response.status === 200) {
          this.disableFormElements();
          this.props.reloadFunction();
          this.props.showNotification("Saved Successfully", "success");
          this.props.getProductByLocation(response.headers.get("Location"));
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
    let file = document.getElementById("productImage").files[0];
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
  getProductCategory = () => {
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

  getCompany = () => {
    fetch(API_URL + "/getAllCompany", {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        const rawData = dataRetrived._embedded.companyGetList;

        this.setState({
          companyList: rawData
        });
      })
      .catch(err => {
        // Do something for an error here
        console.log("Error", err);
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
    const names = [
      "Oliver Hansen",
      "Van Henry",
      "April Tucker",
      "Ralph Hubbard",
      "Omar Alexander",
      "Carlos Abbott",
      "Miriam Wagner",
      "Bradley Wilkerson",
      "Virginia Andrews",
      "Kelly Snyder"
    ];
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
              <h2>Product Name</h2>
              <TextValidator
                disabled={this.state.disableFormElements}
                name="productName"
                validators={["required"]}
                errorMessages={["Product Name Required"]}
                value={this.state.productName}
                onChange={this.handleChange}
                margin="dense"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormControl>
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={this.state.disableFormElements}
                  name="canBeSold"
                  onChange={this.handleChangeByName("canBeSold")}
                  color="primary"
                  checked={this.state.canBeSold == true}
                />
              }
              label="Can be Sold"
            />
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={this.state.disableFormElements}
                  onChange={this.handleChangeByName("canBePurchased")}
                  color="primary"
                  name="canBePurchased"
                  checked={this.state.canBePurchased == true}
                />
              }
              label="Can be Purchased"
            />
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
                id="productImage"
              />
            </FormControl>
            <br />
          </GridItem>
        </GridContainer>

        <Tabs
          value={this.state.tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleTabChange}
        >
          <Tab label="General Information" />
          <Tab label="Sales" />
          <Tab label="Company" />
          <Tab label="Inventory" />
        </Tabs>
        {/* General Information Tab */}
        {this.state.tabValue === 0 && (
          <TabContainer>
            <GridContainer>
              <GridItem>
                <FormControl required className={classes.formControl}>
                  <SelectValidator
                    disabled={this.state.disableFormElements}
                    label="Product Type"
                    name="productType"
                    validators={["required"]}
                    errorMessages={["Product Type Required"]}
                    value={this.state.productType}
                    onChange={this.handleChange}
                    input={<Input name="productType" id="productType" />}
                    InputLabelProps={{
                      shrink: true
                    }}
                  >
                    <MenuItem value="0">All</MenuItem>
                    {PRODUCT_TYPE_LIST.map(
                      n => (
                        <MenuItem value={n}>{n}</MenuItem>
                      ),
                      this
                    )}
                  </SelectValidator>
                </FormControl>
                <br />
                <FormControl required className={classes.formControl}>
                  <SelectValidator
                    disabled={this.state.disableFormElements}
                    name="productCategory"
                    label="Product Category"
                    value={this.state.productCategory}
                    onChange={this.handleChange}
                    validators={["required"]}
                    errorMessages={["Product Category Required"]}
                    input={
                      <Input name="productCategory" id="productCategory" />
                    }
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
                  </SelectValidator>
                </FormControl>
                <br />
                <FormControl required className={classes.formControl}>
                  <TextValidator
                    disabled={this.state.disableFormElements}
                    name="internalReference"
                    validators={["required"]}
                    errorMessages={["Internal Reference Required"]}
                    onChange={this.handleChange}
                    value={this.state.internalReference}
                    label="Internal Reference"
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
                    name="barcode"
                    value={this.state.barcode}
                    onChange={this.handleChange}
                    label="Barcode"
                    validators={["required"]}
                    errorMessages={["Barcode Required"]}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>
                <br />
                <FormControl required className={classes.formControl}>
                  <TextValidator
                    disabled={this.state.disableFormElements}
                    name="internalNotes"
                    value={this.state.internalNotes}
                    onChange={this.handleChange}
                    label="Internal Notes"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl required className={classes.formControl}>
                  <TextValidator
                    disabled={this.state.disableFormElements}
                    type="number"
                    name="salePrice"
                    validators={["required"]}
                    errorMessages={["Sale Price Required"]}
                    value={this.state.salePrice}
                    onChange={this.handleChange}
                    label="Sale Price"
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
                    name="cost"
                    value={this.state.cost}
                    onChange={this.handleChange}
                    label="Cost"
                    validators={["required"]}
                    errorMessages={["Cost Required"]}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>

                <br />
              </GridItem>
            </GridContainer>
          </TabContainer>
        )}
        {/* Sales Tab */}
        {this.state.tabValue === 1 && (
          <TabContainer>
            <GridContainer>
              <GridItem>
                <h2>Point Of Sale</h2>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={this.state.disableFormElements}
                      onChange={this.handleChangeByName("availableInPos")}
                      color="primary"
                      checked={this.state.availableInPos == true}
                      name="availableInPos"
                    />
                  }
                  label="Available in POS"
                />
              </GridItem>
            </GridContainer>
          </TabContainer>
        )}
        {/* Purchase Tab */}
        {this.state.tabValue === 2 && (
          <TabContainer>
            <GridContainer>
              <GridItem>
                <h2>Companies</h2>
                <FormControl required className={classes.formControl}>
                  <InputLabel htmlFor="companies">Companies</InputLabel>
                  <Select
                    multiple
                    label="Companies"
                    value={this.state.companies}
                    onChange={this.handleChangeForCompany}
                    input={<Input id="companies" />}
                    renderValue={selected => (
                      <div className={classes.chips}>
                        {selected.map(value => (
                          <Chip
                            key={value.id}
                            label={value.companyName}
                            className={classes.chip}
                          />
                        ))}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {/* <MenuItem value="0">All</MenuItem> */}
                    {this.state.companyList.map(
                      n => (
                        <MenuItem value={n}>{n.companyName}</MenuItem>
                      ),
                      this
                    )}

                    {/* {this.state.companyList.map(company => (
                      <MenuItem
                        key={"fgh"}
                        value={"dfgdft"}
                        // style={getStyles(name, personName, theme)}
                      >
                        {company}
                      </MenuItem>
                    ))} */}
                  </Select>
                </FormControl>
              </GridItem>
            </GridContainer>
          </TabContainer>
        )}
        {/* Inventory Tab */}
        {this.state.tabValue === 3 && (
          <TabContainer>
            <GridContainer>
              <GridItem>
                <h2>Operations</h2>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={this.state.disableFormElements}
                      onChange={this.handleChangeByName("makeToOrder")}
                      color="primary"
                      checked={this.state.makeToOrder == true}
                      name="makeToOrder"
                    />
                  }
                  label="Make To Order"
                />
                <br />
                <FormControl required className={classes.formControl}>
                  <TextValidator
                    disabled={this.state.disableFormElements}
                    type="number"
                    name="customerLeadTime"
                    value={this.state.customerLeadTime}
                    onChange={this.handleChange}
                    label="Customer Lead Time(days)"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>
                <br />
                <FormControl required className={classes.formControl}>
                  <TextValidator
                    disabled={this.state.disableFormElements}
                    name="descDelOrder"
                    value={this.state.descDelOrder}
                    onChange={this.handleChange}
                    label="Description for Delivery Orders"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>
                <br />
                <FormControl required className={classes.formControl}>
                  <TextValidator
                    disabled={this.state.disableFormElements}
                    name="descReceipt"
                    value={this.state.descReceipt}
                    onChange={this.handleChange}
                    label="Description for Receipts"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <h2>Logistics</h2>
                <FormControl required className={classes.formControl}>
                  <TextValidator
                    disabled={this.state.disableFormElements}
                    type="number"
                    name="weight"
                    value={this.state.weight}
                    onChange={this.handleChange}
                    label="Weight"
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
                    name="volume"
                    value={this.state.volume}
                    onChange={this.handleChange}
                    label="Volume"
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
                    name="quantity"
                    value={this.state.quantity}
                    onChange={this.handleChange}
                    label="Quantity"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>
                <br />
                <FormControl required className={classes.formControl}>
                  <SelectValidator
                    disabled={this.state.disableFormElements}
                    value={this.state.responsible}
                    label="Responsible"
                    name="responsible"
                    onChange={this.handleChange}
                    input={<Input name="responsible" id="responsible" />}
                    InputLabelProps={{
                      shrink: true
                    }}
                  >
                    <MenuItem value="0">All</MenuItem>
                    {/* {PRODUCT_TYPE_LIST.map(
                      n => (
                        <MenuItem value={n}>{n}</MenuItem>
                      ),
                      this
                    )} */}
                  </SelectValidator>
                </FormControl>
              </GridItem>
            </GridContainer>
          </TabContainer>
        )}
      </ValidatorForm>
      //   </GridItem>
      // </GridContainer>
    );
  }
}

export default withStyles(customInputStyle)(ProductForm);
