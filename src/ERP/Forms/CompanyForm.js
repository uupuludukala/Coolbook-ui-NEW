import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { API_URL } from "../properties/applicationProperties";
import FormControl from "@material-ui/core/FormControl";
import Camera from "@material-ui/icons/CameraEnhance";
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
class CompanyForm extends React.Component {
    
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
            companyCode: "",
            companyName: "",
            addressLine1: "",
            addressLine2: "",
            addressLine3: "",
            contactNumber: ""
        });
    };

    setFormData = dataRetrived => {
        console.log("dataRetrived", dataRetrived);
        this.setState({ ...dataRetrived });
        this.disableFormElements();
    };
    disableFormElements = () => {
        this.setState({ disableFormElements: true });
    };

    enableFormElements = () => {
        this.setState({ disableFormElements: false });
    };
    deleteCompany = () => {
        fetch(API_URL + "/deleteCompany/" + this.state.id, {
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
        const company = {
            companyCode: this.state.companyCode,
            companyName: this.state.companyName,
            addressLine1: this.state.addressLine1,
            addressLine2: this.state.addressLine2,
            addressLine3: this.state.addressLine3,
            contactNumber: this.state.contactNumber
        };
        let requestMethod = this.state.saveMode === "Update" ? "PUT" : "POST";
        fetch(
            API_URL +
            (this.state.saveMode === "Update"
                ? "/saveCompany/" + this.state.id
                : "/saveCompany"),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + window.localStorage.getItem("access_token")
                },
                method: requestMethod,
                body: JSON.stringify(company)
            }
        )
            .then(response => {
                if (response.status === 201 || response.status === 200) {
                    this.disableFormElements();
                    this.props.reloadFunction();
                    this.props.showNotification("Saved Successfully", "success");
                    this.props.getCompanyByLocation(response.headers.get("Location"));
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
                            <h2>Company Name</h2>
                            <TextValidator
                                disabled={this.state.disableFormElements}
                                name="companyName"
                                validators={["required"]}
                                errorMessages={["Company Name Required"]}
                                value={this.state.companyName}
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
                                label="Company Code"
                                disabled={this.state.disableFormElements}
                                name="companyCode"
                                validators={["required"]}
                                errorMessages={["Company Code Required"]}
                                value={this.state.companyCode}
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
                       
                        <br />
                    </GridItem>
                </GridContainer>
            </ValidatorForm>
            //   </GridItem>
            // </GridContainer>
        );
    }
}

export default withStyles(customInputStyle)(CompanyForm);
