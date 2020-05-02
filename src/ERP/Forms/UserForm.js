import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { API_URL } from "../properties/applicationProperties";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {
    ValidatorForm,
    TextValidator
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
class UserForm extends React.Component {
    state = {
        companies: [],
        branches: [],
        imageUrl: "",
        companyIds: [],
        tabValue: 0,
        companyList: [],
        selectedCompany: {
            
        },
        selectedBranch:{}
    };
    branchChange = event => {
        if (event !== null) {
            this.getBranch(
                0,
                10,
                event.target.value !== undefined ? event.target.value : ""
            );
        }
    };
    getBranch = (page, pageSize, searchValue) => {
        if (this.state.selectedCompany !== null && this.state.selectedCompany !== undefined) {
            this.setState({ pageSize: pageSize });
            let searchParameters =
                this.getSearchParameters(page, pageSize) + "&searchValue=" + searchValue + "&companyId=" + this.state.selectedCompany.id;
            fetch(API_URL + "/searchBranch?" + searchParameters, {
                headers: {
                    Authorization: "Bearer " + window.localStorage.getItem("access_token")
                }
            })
                .then(response => {
                    return response.json();
                })
                .then(dataRetrived => {
                    if (dataRetrived.page.totalPages !== 0) {
                        const rawData = dataRetrived._embedded.branchGetList;
                        this.setState({
                            branches: rawData
                        });
                    } else {
                        this.setState({
                            branches: []
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
                    console.log("Error", err);
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

    getSelectedBranch = id => {
        fetch(API_URL + "/getBranchById/" + id, {
            headers: {
                Authorization: "Bearer " + window.localStorage.getItem("access_token")
            }
        })
            .then(response => {
                return response.json();
            })
            .then(dataRetrived => {
                this.setState({
                    branches: [dataRetrived],
                    selectedBranch: dataRetrived
                });
                console.log('dataRetrived', this.state.selectedBranch);
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
    selectCompany = (event, value) => {
        if (value !== null) {
            this.setState({
                selectedCompany: value,
                branches: [],
                selectedBranch: ""
            });

        } else {
            this.setState({
                selectedCompany: null,
                branches: [],
                selectedBranch: null
            });
        }
    };
    selectBranch = (event, value) => {
        if (value !== null) {
            this.setState({
                selectedBranch: value
            });
        } else {
            this.setState({
                selectedBranch: null
            });
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
            branch: 0,
            password: "",
            userName: "",
            selectedCompany: {},
            selectedBranch:{}
        });
    };

    setFormData = dataRetrived => {
        this.setState({ ...dataRetrived });
        this.disableFormElements();
        this.getSelectedCompany(dataRetrived.companyId);
        this.getSelectedBranch(dataRetrived.branchId);
    };
    disableFormElements = () => {
        this.setState({ disableFormElements: true });
    };

    enableFormElements = () => {
        this.setState({ disableFormElements: false });
    };
    deleteUser = () => {
        fetch(API_URL + "/deleteUser/" + this.state.id, {
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
        const user = {
            branch: this.state.selectedBranch.id,
            password: this.state.password,
            userName: this.state.userName
        };
        let requestMethod = this.state.saveMode === "Update" ? "PUT" : "POST";
        fetch(
            API_URL +
            (this.state.saveMode === "Update"
                ? "/saveUser/" + this.state.id
                : "/saveUser"),
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + window.localStorage.getItem("access_token")
                },
                method: requestMethod,
                body: JSON.stringify(user)
            }
        )
            .then(response => {
                if (response.status === 201 || response.status === 200) {
                    this.disableFormElements();
                    this.props.reloadFunction();
                    this.props.showNotification("Saved Successfully", "success");
                    this.props.getUserByLocation(response.headers.get("Location"));
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
    componentDidMount() {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });

    }

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
                            <h4>Branch Name</h4>
                            <Autocomplete
                                value={this.state.selectedBranch}
                                disabled={this.state.disableFormElements}
                                label="Branch"
                                id="branch"
                                options={this.state.branches}
                                onInputChange={this.branchChange}
                                getOptionLabel={option => option.branchName}
                                onChange={(event, value) =>
                                    this.selectBranch(event, value)
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
                                label="User Name"
                                disabled={this.state.disableFormElements}
                                name="userName"
                                validators={["required"]}
                                errorMessages={["User Name Required"]}
                                value={this.state.userName}
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
                                label="Password"
                                onChange={this.handleChange}
                                disabled={this.state.disableFormElements}
                                name="password"
                                type="password"
                                validators={['required']}
                                errorMessages={['this field is required']}
                                value={this.state.password}
                            />
                            <br />
                            <TextValidator
                                label="Repeat password"
                                onChange={this.handleChange}
                                disabled={this.state.disableFormElements}
                                name="repeatPassword"
                                type="password"
                                validators={['isPasswordMatch', 'required']}
                                errorMessages={['password mismatch', 'this field is required']}
                                value={this.state.repeatPassword}
                            />
                        </FormControl>
                    </GridItem>
                </GridContainer>
            </ValidatorForm>
        );
    }
}

export default withStyles(customInputStyle)(UserForm);
