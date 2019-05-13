import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";

class InvoiceProductTable extends React.Component {
  render() {
    let headers = this.props.headers;
    let dataList = this.props.dataList;
    return (
      <Table>
        <TableHead>
          <TableRow>
            {headers.map(
              row => (
                <TableCell>{row}</TableCell>
              ),
              this
            )}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {dataList.map(data => (
            <TableRow>
              <TableCell>{data.productCode}</TableCell>
              <TableCell>{data.productName}</TableCell>
              <TableCell>{data.salePrice}</TableCell>
              <TableCell>1</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default InvoiceProductTable;
