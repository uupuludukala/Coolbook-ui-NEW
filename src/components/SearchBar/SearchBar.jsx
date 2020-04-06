import React from "react";
import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle.jsx";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import {
  FormControl,
  TextValidator,
  ValidatorForm
} from "react-material-ui-form-validator";

class SearchBar extends React.Component {
  state = {
    searchValue: []
  };
  cancelSearch = () => {
    this.props.searchDialogCloseFunction();
    console.log("Cancel Button Clicked");
  };
  handleChange = event => {
    this.state.searchValue[event.target.name] = event.target.value;
  };

  search = () => {
    let queryParameters = "";
    for (const [key, value] of Object.entries(this.state.searchValue)) {
      console.log(key, value);
      queryParameters += "&" + key + "=" + value;
    }
    this.props.getQueryParameter(queryParameters);
    this.props.searchDialogCloseFunction();
  };
  render() {
    const { searchFields } = this.props;
    const { classes } = this.props;
    return (
      <ValidatorForm
        ref="form"
        onSubmit={this.save}
        onError={errors => console.log(errors)}
      >
        <div>
          {searchFields.map(
            field => (
              <div>
                {
                  {
                    Text: (
                      <div>
                        <InputLabel id="demo-controlled-open-select-label">
                          {field.label}
                        </InputLabel>
                        <TextField
                          id={field.name}
                          name={field.name}
                          onChange={this.handleChange}
                        />
                      </div>
                    ),
                    Option: (
                      <div>
                        <InputLabel id="demo-controlled-open-select-label">
                          {field.label}
                        </InputLabel>
                        <Select id={field.name} name={field.name} value={" "}>
                          {field.data.map(
                            data => (
                              <MenuItem value="10">{data} </MenuItem>
                            ),
                            this
                          )}
                        </Select>
                      </div>
                    )
                  }[field.type]
                }
              </div>
            ),
            this
          )}
          <Button
            id="cancelButton"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.cancelSearch}
          >
            CANCEL
          </Button>
          <div
            style={{ width: "7px", height: "auto", display: "inline-block" }}
          />
          <Button
            id="searchButton"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.search}
          >
            SEARCH
          </Button>
        </div>
      </ValidatorForm>
    );
  }
}

export default withStyles(customInputStyle)(SearchBar);
