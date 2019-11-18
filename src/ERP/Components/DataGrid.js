import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

class DataGrid extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Table
        rowsPerPageOptions={[5, 10, 20, 25, 50, 100]}
        rowsCount={10}
        rowsPerPage={20}
        page={2}
        tableHeaderColor="primary"
        tableHead={["Name", "Country", "City", "Salary"]}
        tableData={[
          ["Dakota Rice", "Niger", "Oud-Turnhout", "$36,738"],
          ["Minerva Hooper", "Curaçao", "Sinaai-Waas", "$23,789"],
          ["Sage Rodriguez", "Netherlands", "Baileux", "$56,142"],
          ["Philip Chaney", "Korea, South", "Overland Park", "$38,735"],
          ["Doris Greene", "Malawi", "Feldkirchen in Kärnten", "$63,542"],
          ["Mason Porter", "Chile", "Gloucester", "$78,615"]
        ]}
      />
    );
  }
}

export default withStyles(styles)(DataGrid);
