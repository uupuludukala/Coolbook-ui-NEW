import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { API_URL } from "../properties/applicationProperties";
import FormControl from "@material-ui/core/FormControl";
import Camera from "@material-ui/icons/CameraEnhance";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
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
class BranchForm extends React.Component {

    state = {
        companies: [],
        selectedCompany: {           
        }
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
    handleChangeForVenderTaxes = event => {
        console.log("event.target.value" + event.target.value);
        const value = [];
        for (let i = 0, l = event.target.value.length; i < l; i += 1) {
            value.push(event.target.value[i]);
        }

        this.setState({ venderTaxes: value });
        // this.state.venderTaxes.push(event.target.value);
        // this.setState({ [event.target.name]: event.target.value });
    };

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
            branchCode: "",
            branchName: "",
            addressLine1: "",
            addressLine2: "",
            addressLine3: "",
            contactNumber: "",
            companies: [],
            selectedCompany: {
                branchCode: "",
                companyName: "",
                addressLine1: "",
                addressLine2: "",
                addressLine3: "",
                contactNumber: "",
                companyId: ""
            }

        });
    };

    setFormData = dataRetrived => {
        console.log("dataRetrived", dataRetrived);
        this.setState({ ...dataRetrived });
        this.disableFormElements();
        this.getSelectedCompany(dataRetrived.companyId);
    };
    disableFormElements = () => {
        this.setState({ disableFormElements: true });
    };

    enableFormElements = () => {
        this.setState({ disableFormElements: false });
    };
    deleteBranch = () => {
        fetch(API_URL + "/deleteBranch/" + this.state.id, {
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
        console.log("Save Function Called");
        const branch = {
            branchCode: this.state.branchCode,
            branchName: this.state.branchName,
            addressLine1: this.state.addressLine1,
            addressLine2: this.state.addressLine2,
            addressLine3: this.state.addressLine3,
            contactNumber: this.state.contactNumber,
            companyId: this.state.selectedCompany.id
        };
        let requestMethod = this.state.saveMode === "Update" ? "PUT" : "POST";
        fetch(
            API_URL +
            (this.state.saveMode === "Update"
                ? "/saveBranch/" + this.state.id
                : "/saveBranch"),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + window.localStorage.getItem("access_token")
                },
                method: requestMethod,
                body: JSON.stringify(branch)
            }
        )
            .then(response => {
                if (response.status === 201 || response.status === 200) {
                    this.disableFormElements();
                    this.props.reloadFunction();
                    this.props.showNotification("Saved Successfully", "success");
                    this.props.getBranchByLocation(response.headers.get("Location"));
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

    selectCompany = (event, value) => {
        if (value !== null) {
            this.setState({
                selectedCompany: value
            });
        } else {
            this.setState({
                selectedCompany: null
            });
        }
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
                // this.refs.toolBar.renderForm();
                // this.refs.companyForm.setFormData(dataRetrived);
                // const rawData = dataRetrived._embedded.companyGetList;
                this.setState({
                    companies: [dataRetrived],
                    selectedCompany: dataRetrived
                });
                console.log('dataRetrived', this.state.selectedCompany.companyCode);
            })
            .catch(err => {
                console.log("Error", err);
            });
    };

    companyChange = event => {
        if (event !== null) {
            this.getCompany(
                0,
                10,
                event.target.value !== undefined ? event.target.value : ""
            );
        }
    };
    getSearchParameters = (page, pageSize) => {
        var parameterString = "page=" + page + "&size=" + pageSize;
        return parameterString;
    };
    getCompany = (page, pageSize, searchValue) => {
        this.setState({ pageSize: pageSize });
        let searchParameters =
            this.getSearchParameters(page, pageSize) + "&searchValue=" + searchValue;
        fetch(API_URL + "/searchCompany?" + searchParameters, {
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
                        companies: rawData
                    });
                } else {
                    this.setState({
                        companies: []
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
                            <h2>Branch Name</h2>
                            <TextValidator
                                disabled={this.state.disableFormElements}
                                name="branchName"
                                validators={["required"]}
                                errorMessages={["Branch Name Required"]}
                                value={this.state.branchName}
                                onChange={this.handleChange}
                                margin="dense"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </FormControl>
                        <br />
                        <FormControl required className={classes.formControl}>
                            <h4>Company Name</h4>
                            <Autocomplete
                                value={this.state.selectedCompany}
                                disabled={this.state.disableFormElements}
                                label="Company"
                                id="company"
                                options={this.state.companies}
                                onInputChange={this.companyChange}
                                getOptionLabel={option => option.companyName}
                                onChange={(event, value) =>
                                    this.selectCompany(event, value)
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
                        <br />

                        <FormControl required className={classes.formControl}>
                            <TextValidator
                                label="Branch Code"
                                disabled={this.state.disableFormElements}
                                name="branchCode"
                                validators={["required"]}
                                errorMessages={["Branch Code Required"]}
                                value={this.state.branchCode}
                                onChange={this.handleChange}
                                margin="dense"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </FormControl>
                        <br />

                        <FormControl required className={classes.formControl}>
                            <TextValidator
                                label="Address Line1"
                                disabled={this.state.disableFormElements}
                                name="addressLine1"
                                validators={["required"]}
                                errorMessages={["AddressLine1 Required"]}
                                value={this.state.addressLine1}
                                onChange={this.handleChange}
                                margin="dense"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </FormControl>
                        <br />

                        <FormControl required className={classes.formControl}>
                            <TextValidator
                                label="Address Line2"
                                disabled={this.state.disableFormElements}
                                name="addressLine2"
                                validators={["required"]}
                                errorMessages={["AddressLine2 Required"]}
                                value={this.state.addressLine2}
                                onChange={this.handleChange}
                                margin="dense"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </FormControl>
                        <br />

                        <FormControl required className={classes.formControl}>
                            <TextValidator
                                label="Address Line3"
                                disabled={this.state.disableFormElements}
                                name="addressLine3"
                                validators={["required"]}
                                errorMessages={["AddressLine3 Required"]}
                                value={this.state.addressLine3}
                                onChange={this.handleChange}
                                margin="dense"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </FormControl>
                        <br />

                        <FormControl required className={classes.formControl}>
                            <TextValidator
                                label="Contact Number"
                                disabled={this.state.disableFormElements}
                                name="contactNumber"
                                validators={["required"]}
                                errorMessages={["Contact Number Required"]}
                                value={this.state.contactNumber}
                                onChange={this.handleChange}
                                margin="dense"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </FormControl>
                        <br />
                    </GridItem>                   
                </GridContainer>
            </ValidatorForm>
            //   </GridItem>
            // </GridContainer>
        );
    }
}

export default withStyles(customInputStyle)(BranchForm);
