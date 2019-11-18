import React from "react";
import ReactDOM from "react-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import Admin from "layouts/Admin.jsx";
import { AUTH_URL } from "./ERP/properties/applicationProperties";

import { withStyles } from "@material-ui/core/styles";

import { createBrowserHistory } from "history";

import "assets/css/material-dashboard-react.css?v=1.6.0";

const styles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

class Login extends React.Component {
  state = {
    username: "furnico",
    password: "furnico"
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  login = () => {
    let requestMethod = "POST";
    fetch(AUTH_URL, {
      headers: { "Content-Type": "application/json" },
      headers: {
        authorization: "Basic c2RmZnM3ODgyM2Fzc2Y4Nzg4c2RmNzg6c2VjcmV0",
        "content-type": "application/x-www-form-urlencoded"
      },
      method: requestMethod,
      body:
        "grant_type=password&username=" +
        this.state.username +
        "&password=" +
        this.state.password
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          console.log("Error Saving Data");
        }
      })
      .then(response => {
        window.localStorage.setItem("access_token", response.access_token);
        console.log("Access Token" + response.access_token);
        ReactDOM.render(
          <Router history={hist}>
            <Switch>
              <Route path="/admin" component={Admin} />
              <Redirect from="/" to="/admin/dashboard" />
            </Switch>
          </Router>,
          document.getElementById("root")
        );
      })
      .catch(error => {
        console.log("error Saving Data catch" + error);
      });
    const hist = createBrowserHistory();
  };
  render() {
    const classes = styles;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              onChange={this.handleChange}
              margin="normal"
              value={this.state.username}
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              variant="outlined"
              onChange={this.handleChange}
              margin="normal"
              required
              value={this.state.password}
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              onClick={this.login}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Typography variant="body2" color="textSecondary" align="center">
            {"Cool Book For"}
            <Link color="inherit" href="https://furnico.lk/">
              Furnico
            </Link>
            {" team."}
          </Typography>
        </Box>
      </Container>
    );
  }
}
export default withStyles(styles)(Login);
