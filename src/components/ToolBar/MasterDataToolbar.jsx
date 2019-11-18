import React from "react";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "@material-ui/core/Button";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import withStyles from "@material-ui/core/styles/withStyles";

class MasterDataToolbar extends React.Component {
  disableSaveButtons = disable => {
    var saveButton = document.getElementById("saveButton");
    saveButton.style.display = disable ? "none" : "inline";
  };
  renderForm = () => {
    var form = document.getElementById("form");
    var main = document.getElementById("main");
    var createButton = document.getElementById("createButton");
    var editButton = document.getElementById("editButton");
    var deleteButton = document.getElementById("deleteButton");
    var discardButton = document.getElementById("discardButton");
    form.style.display = "block";
    main.style.display = "none";
    createButton.style.display = "none";
    editButton.style.display = "inline";
    deleteButton.style.display = "inline";
    discardButton.style.display = "inline";
  };
  renderGrid = () => {
    this.props.resetForm();
    var main = document.getElementById("main");
    var form = document.getElementById("form");
    var createButton = document.getElementById("createButton");
    this.disableSaveButtons(true);
    var editButton = document.getElementById("editButton");
    var deleteButton = document.getElementById("deleteButton");
    var discardButton = document.getElementById("discardButton");
    main.style.display = "block";
    form.style.display = "none";
    createButton.style.display = "inline";
    editButton.style.display = "none";
    deleteButton.style.display = "none";
    discardButton.style.display = "none";
  };
  enableEditMode = () => {
    this.props.enableEditModeFuction();
    var editButton = document.getElementById("editButton");
    var deleteButton = document.getElementById("deleteButton");
    this.disableSaveButtons(false);
    editButton.style.display = "none";
    deleteButton.style.display = "none";
  };
  enableAddMode = () => {
    this.props.enableAddModeFuction();
    this.renderForm();
    var editButton = document.getElementById("editButton");
    var deleteButton = document.getElementById("deleteButton");
    this.disableSaveButtons(false);
    editButton.style.display = "none";
    deleteButton.style.display = "none";
  };

  deleteSelected = () => {
    this.props.deleteSelected();
  };

  render() {
    const { classes } = this.props;
    return (
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>Simple Table</h4>
        <Button
          id="createButton"
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.enableAddMode}
        >
          CREATE
        </Button>
        <div
          style={{ width: "7px", height: "auto", display: "inline-block" }}
        />

        <Button
          id="saveButton"
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.props.submitForm}
          style={{ display: "none" }}
        >
          SAVE
        </Button>

        <div
          style={{ width: "7px", height: "auto", display: "inline-block" }}
        />
        <Button
          id="editButton"
          variant="contained"
          color="secondaryprimary"
          className={classes.button}
          onClick={this.enableEditMode}
          style={{ display: "none" }}
        >
          EDIT
        </Button>
        <div
          style={{ width: "7px", height: "auto", display: "inline-block" }}
        />
        <Button
          id="deleteButton"
          variant="contained"
          color="secondaryprimary"
          className={classes.button}
          onClick={this.deleteSelected}
          style={{ display: "none" }}
        >
          DELETE
        </Button>
        <div
          style={{ width: "7px", height: "auto", display: "inline-block" }}
        />
        <Button
          id="discardButton"
          variant="contained"
          color="secondaryprimary"
          className={classes.button}
          onClick={this.renderGrid}
          style={{ display: "none" }}
        >
          CANCEL
        </Button>
      </CardHeader>
    );
  }
}
export default withStyles(dashboardStyle)(MasterDataToolbar);
