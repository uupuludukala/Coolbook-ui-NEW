import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import tableStyle from "assets/jss/material-dashboard-react/components/tableStyle.jsx";

class CustomTable extends React.Component {
  state = {
    page: this.props.page
  };
  handleChangePage = (event, page) => {
    this.setState({
      page: page,
      rowsPerPage: this.props.rowsPerPage,
      rowsCount: this.props.rowsCount,
      totalPages: this.props.totalPages,
      data: this.props.data
    });
    this.props.getDataFunction(page, this.props.rowsPerPage);
  };
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
    this.props.getDataFunction(this.state.page, event.target.value);
  };
  render() {
    const {
      classes,
      tableHead,
      tableData,
      tableHeaderColor,
      rowsPerPage,
      rowsCount,
      page
    } = this.props;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, rowsCount - page * rowsPerPage);
    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table}>
          {tableHead !== undefined ? (
            <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
              <TableRow>
                {tableHead.map((prop, key) => {
                  return (
                    <TableCell className={classes.tableHeadCell} key={key}>
                      {prop.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
          ) : null}
          <TableBody>
            {/* {tableData.map((tableRow, key) => {
              return (
                <TableRow key={key}>
                  {tableRow.map((prop, key) => {
                    return (
                      <TableCell className={classes.tableCell} key={key}>
                        {prop}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })} */}
            {tableData.map((n, index) => {
              return (
                <TableRow
                  onClick={() => this.props.getSelectedRowFuction(n.id)}
                  hover
                  // role="checkbox"
                  // tabIndex={-1}
                  key={n.id}
                  // className="gridRaw"
                >
                  {/* {Object.keys(n).map( */}
                  {tableHead.map(
                    datarow => (
                      <TableCell>
                        {typeof n[datarow.id] === "boolean"
                          ? n[datarow.id]
                            ? "Yes"
                            : "No"
                          : n[datarow.id]}{" "}
                      </TableCell>
                    ),
                    this
                  )}
                </TableRow>
              );
            })}

            {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TablePagination
            rowsPerPageOptions={this.props.rowsPerPageOptions}
            component="div"
            count={this.props.rowsCount}
            rowsPerPage={this.props.rowsPerPage}
            page={this.props.page}
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Table>
      </div>
    );
  }
}

export default withStyles(tableStyle)(CustomTable);
