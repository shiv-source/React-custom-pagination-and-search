import React, { Component } from "react";
import {
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { apiUrl } from "../config/apiUrl";
import axios from "axios";
import { Link } from "react-router-dom";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      currentPage: 1,
      lastPage : null,
      dataPerPage: 10,
      currentPageData: [],
    };
    this.handlePagination = this.handlePagination.bind(this);
  }

  handlePagination(pageNumber) {
    let dataPerPage = this.state.dataPerPage;
    let totalPage = Math.ceil(this.state.contacts.length / dataPerPage);

    if (pageNumber <= totalPage && pageNumber > 0) {
      this.setState({ lastPage: totalPage }, () =>
        console.log(this.state.lastPage)
      );
      let endIndex = pageNumber * dataPerPage;
      let startIndex = endIndex - dataPerPage;
      let totalData = this.state.contacts;
      console.log(totalData);
      let currentPageData = totalData.slice(startIndex, endIndex);

      this.setState({ currentPageData: currentPageData }, () =>
        console.log(this.state.currentPageData)
      );

      this.setState({ currentPage: pageNumber });
    }
  }

  componentDidMount() {
    axios.get(apiUrl + "contact").then((res) => {
      this.setState({ contacts: res.data }, () =>
        console.log(this.state.contacts)
      );
      this.handlePagination(1);
    });
  }

  render() {
    const renderTableData = () => {
      return this.state.currentPageData.map((contact) => {
        if (contact) {
          return (
            <tr key={contact.id}>
              <th scope="row">{contact.id} </th>
              <td>{contact.firstname}</td>
              <td>{contact.lastname} </td>
              <td>{contact.email}</td>
              <td>
                <span style={{ color: "blue" }}>
                  <i
                    className="fa fa-pencil-square-o fa-lg"
                    aria-hidden="true"
                  ></i>
                </span>
              </td>
              <td>
                <span style={{ color: "red" }}>
                  <i className="fa fa-trash fa-lg" aria-hidden="true"></i>
                </span>
              </td>
            </tr>
          );
        } else {
          return <div></div>;
        }
      });
    };


    const renderPagination = () => {

        return (
            <Pagination aria-label="Page navigation example">
            <Link to={`/${1}`}>
              <PaginationItem   onClick={() => this.handlePagination(1)}>
                <PaginationLink first />
              </PaginationItem>
            </Link>
            <Link to={`/${this.state.currentPage-1}`}>
              <PaginationItem onClick={() => this.handlePagination(this.state.currentPage -1)}>
                <PaginationLink previous />
              </PaginationItem>
            </Link>
            <Link to={`/${this.state.currentPage}`}>
              <PaginationItem
                active
                onClick={() => this.handlePagination(this.state.currentPage)}
              >
                <PaginationLink>{this.state.currentPage}</PaginationLink>
              </PaginationItem>
            </Link>
            <Link to={`/${this.state.currentPage+1}`}>
              <PaginationItem  onClick={() => this.handlePagination(this.state.currentPage +1)}>
                <PaginationLink next />
              </PaginationItem>
            </Link>
            <Link to={`/${this.state.lastPage}`}>
              <PaginationItem onClick={() => this.handlePagination(this.state.lastPage)}>
                <PaginationLink last />
              </PaginationItem>
            </Link>
          </Pagination>
        )
        
    }

  
    return (
      <div className="container">
        <div className="mt-3">
          <h2 className="text-center"> Contact List </h2>
          <div className="Pagination">
           {renderPagination()}
          </div>
          <div className="text-right">
            <Button color="primary">
              <span>
                <i className="fa fa-plus fa-lg" aria-hidden="true"></i> Add
                Contact
              </span>
            </Button>
          </div>
          <Table hover={true} className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email ID</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>{renderTableData()}</tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default Main;
