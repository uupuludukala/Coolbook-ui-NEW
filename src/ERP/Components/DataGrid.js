import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;
    const rows = this.props.rows;
    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row =>
              row.display && (
                <TableCell
                  key={row.id}
                  // align={row.numeric ? "right" : "left"}
                  align={"right"}
                  padding={row.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === row.id ? order : false}
                >
                  <Tooltip
                    title="Sort"
                    placement={row.numeric ? "bottom-end" : "bottom-start"}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === row.id}
                      direction={order}
                      onClick={this.createSortHandler(row.id)}
                    >
                      {row.label}
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              ),
            this
          )}
          <TableCell>Action </TableCell>
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  },
  gridRaw: {
    height: "10px"
  }
});

class EnhancedTable extends React.Component {
  state = {
    order: "asc",
    orderBy: "calories",
    data: this.props.data,
    rowsPerPage: this.props.rowsPerPage,
    totalElements: this.props.totalElements,
    totalPages: this.props.totalPages,
    page: this.props.page
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  openEditForm = row => {
    this.props.rowOnclickFunction();
    this.props.rowSelected(row);
  };

  handleChangePage = (event, page) => {
    //   console.log("Page is", page);

    this.setState({
      page: page,
      rowsPerPage: this.props.rowsPerPage,
      totalElements: this.props.totalElements,
      totalPages: this.props.totalPages,
      data: this.props.data
    });
    this.props.getDataFunction(page, this.props.rowsPerPage);
  };

  handleChangeRowsPerPage = event => {
    console.log("Page change called");
    this.setState({ rowsPerPage: event.target.value });
    this.props.getDataFunction(this.state.page, event.target.value);
  };

  render() {
    const { classes } = this.props;
    const { order, orderBy, rowsPerPage, totalElements, page } = this.props;
    const data = this.props.data;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, totalElements - page * rowsPerPage);
    // console.log('Data Lenght',data);
    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              rows={this.props.rows}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {/* {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
              {data.map((n, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={n.id}
                    className="gridRaw"
                  >
                    {/* {Object.keys(n).map( */}
                    {this.props.rows.map(
                      datarow =>
                        datarow.display && (
                          <TableCell align="right">
                            {typeof n[datarow.id] === "boolean"
                              ? n[datarow.id]
                                ? "Yes"
                                : "No"
                              : n[datarow.id]}{" "}
                          </TableCell>
                        ),
                      this
                    )}
                    <TableCell>
                      <EditIcon onClick={event => this.openEditForm(n)} />
                      <DeleteIcon
                        onClick={() => this.props.deleteFunction(n.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 25, 50, 100]}
          component="div"
          count={totalElements}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EnhancedTable);
