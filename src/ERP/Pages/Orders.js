import React from "react";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core/styles";
import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle.jsx";
import Card from "components/Card/Card.jsx";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { API_URL } from "../properties/applicationProperties";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

class Orders extends React.Component {
  state = {
    tabValue: 0,
    customers: [],
    productLines: [],
    products: [],
    productCount: 0
  };
  selectCustomer = (event, value) => {
    if (value !== null) {
      this.setState({
        selectedCustomer: value
      });
    } else {
      this.setState({
        selectedCustomer: null
      });
    }
  };
  selectProduct = (event, value, lineId) => {
    console.log("lineId", lineId);
    let product;
    if (value !== null) {
      product = {
        lineId: lineId,
        id: value.id,
        description: value.productName,
        quantity: 1,
        unitPrice: value.salePrice,
        taxes: "0.00",
        subtotal: value.salePrice
      };
    } else {
      product = {
        lineId: lineId,
        id: 0,
        description: "",
        quantity: 0.0,
        unitPrice: 0.0,
        taxes: 0.0,
        subtotal: 0.0
      };
    }
    this.state.productLines[lineId] = product;
  };

  customerChange = event => {
    this.getCustomer(
      0,
      10,
      event.target.value !== undefined ? event.target.value : ""
    );
  };
  productChange = event => {
    this.getProduct(
      0,
      10,
      event.target.value !== undefined ? event.target.value : ""
    );
  };
  getProduct = (page, pageSize, searchValue) => {
    this.setState({ pageSize: pageSize });
    let searchParameters =
      this.getSearchParameters(page, pageSize) + "&searchValue=" + searchValue;
    fetch(API_URL + "/searchProduct?" + searchParameters, {
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("access_token")
      }
    })
      .then(response => {
        return response.json();
      })
      .then(dataRetrived => {
        if (dataRetrived.page.totalPages !== 0) {
          const rawData = dataRetrived._embedded.productGetList;
          this.setState({
            products: rawData
          });
        } else {
          this.setState({
            products: []
          });
        }
        this.setState({
          pageSize: dataRetrived.page.size,
          totalPages: dataRetrived.page.totalPages,
          rowsCount: dataRetrived.page.totalElements,
          page: dataRetrived.page.number
        });
      })
      .catch(err => {
        // Do something for an error here
        console.log("Error", err);
      });
  };
  getSearchParameters = (page, pageSize) => {
    var parameterString = "page=" + page + "&size=" + pageSize;
    return parameterString;
  };
  getCustomer = (page, pageSize, searchValue) => {
    this.setState({ pageSize: pageSize });
    let searchParameters =
      this.getSearchParameters(page, pageSize) + "&searchValue=" + searchValue;
    fetch(API_URL + "/searchCustomer?" + searchParameters, {
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
            customers: rawData
          });
        } else {
          this.setState({
            customers: []
          });
        }
        this.setState({
          pageSize: dataRetrived.page.size,
          totalPages: dataRetrived.page.totalPages,
          rowsCount: dataRetrived.page.totalElements,
          page: dataRetrived.page.number
        });
      })
      .catch(err => {
        // Do something for an error here
        console.log("Error", err);
      });
  };
  addProductLine = () => {
    let product = {
      lineId: this.state.productCount + 1,
      id: 0,
      description: "",
      quantity: 0.0,
      unitPrice: 0.0,
      taxes: 0.0,
      subtotal: 0.0
    };
    this.setState({ productCount: this.state.productCount + 1 });
    this.state.productLines[this.state.productCount + 1] = product;
    console.log("Add product Line", this.state.productCount);
  };
  generateProductLine() {
    // productItems
    return this.state.productLines.map(el => {
      return (
        <TableRow>
          <TableCell>
            <Autocomplete
              id={el.id}
              options={this.state.products}
              onInputChange={this.productChange}
              getOptionLabel={option => option.productName}
              onChange={(event, value, k = el) =>
                this.selectProduct(event, value, k.lineId)
              }
              style={{ width: 300 }}
              renderInput={params => (
                <TextField {...params} label="" variant="outlined" fullWidth />
              )}
            />
          </TableCell>
          <TableCell>{el.description}</TableCell>
          <TableCell>
            <TextField
              type="number"
              name={el.lineId}
              value={el.quantity}
              onChange={event => this.changeQuantity(event)}
            />
          </TableCell>
          <TableCell>{el.unitPrice.toFixed(2)}</TableCell>
          <TableCell>{parseFloat(el.taxes).toFixed(2)}</TableCell>
          <TableCell>{el.subtotal.toFixed(2)}</TableCell>
        </TableRow>
      );
    });
  }

  changeQuantity = event => {
    // this.setState({ [event.target.name]: event.target.value });

    let product = this.state.productLines[event.target.name];
    product.quantity = event.target.value;
    product.subtotal = product.quantity * product.unitPrice;
    console.log("product", product);
    this.state.productLines[event.target.name] = product;
    console.log("event.target.name", event.target.name);
    console.log(
      "this.state.productLines[event.target.name]",
      this.state.productLines[event.target.name]
    );
    this.setState({ productLines: this.state.productLines });
  };
  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <ValidatorForm
              ref="form"
              onSubmit={this.save}
              onError={errors => console.log(errors)}
            >
              <GridContainer>
                <GridItem>
                  <FormControl required className={classes.formControl}>
                    <h2>Customer Name</h2>
                    <Autocomplete
                      id="customer"
                      options={this.state.customers}
                      onInputChange={this.customerChange}
                      getOptionLabel={option => option.customerName}
                      onChange={(event, value) =>
                        this.selectCustomer(event, value)
                      }
                      style={{ width: 300 }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label=""
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  {this.state.selectedCustomer !== undefined &&
                  this.state.selectedCustomer !== null ? (
                    <div>
                      <br />
                      <br />
                      <br />
                      NIC : {this.state.selectedCustomer.nicNumber}
                      <br />
                      Address : {this.state.selectedCustomer.addressLine1},
                      {this.state.selectedCustomer.addressLine2},
                      {this.state.selectedCustomer.addressLine3}
                      <br />
                      Mobile Number :{this.state.selectedCustomer.mobileNumer}
                      <br />
                      Home Phone :{this.state.selectedCustomer.homePhone}
                      <br />
                    </div>
                  ) : (
                    ""
                  )}
                </GridItem>
              </GridContainer>
              <Tabs
                value={this.state.tabValue}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleTabChange}
              >
                <Tab label="Order Lines" />
              </Tabs>
              {this.state.tabValue === 0 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Taxes</TableCell>
                      <TableCell>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <a
                        href="javascrpt:addProductLine()"
                        onClick={this.addProductLine}
                      >
                        Add a Product
                      </a>
                    </TableRow>
                    {this.generateProductLine()}
                  </TableBody>
                </Table>
              )}
              <div>
                <div>
                  <FormControl required className={classes.formControl}>
                    <TextValidator
                      label="Terms and Conditions"
                      name="termsAndCond"
                      validators={[]}
                      errorMessages={[]}
                      value={this.state.termsAndCond}
                      margin="dense"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </FormControl>
                </div>
                <div>
                  <div>
                    <b>Untaxed Amount : </b>
                  </div>
                  <div>
                    <b>Taxes : </b>
                  </div>
                  <div>
                    <b>Total :</b>
                  </div>
                </div>
              </div>
            </ValidatorForm>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
// export default Orders;

export default withStyles(customInputStyle)(Orders);
