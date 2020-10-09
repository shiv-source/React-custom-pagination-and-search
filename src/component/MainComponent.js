import React, { Component } from "react";
import {
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Col,
  Label,
  Form,
  Input,
  FormGroup,
} from "reactstrap";
import { apiUrl } from "../config/apiUrl";
import axios from "axios";
import { Link } from "react-router-dom";
import { LocalForm, Control, Errors } from "react-redux-form";
import { RenderLoader } from "./LoadingComponent";

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;
const validEmail = (val) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      currentPage: 1,
      lastPage: null,
      dataPerPage: 10,
      currentPageData: [],
      isModelOpen: false,
      isLoading: true,
      searchInput: "",
      totalSearchResult: null,
    };
    this.handlePagination = this.handlePagination.bind(this);
    this.toggleModel = this.toggleModel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handlePagination(pageNumber) {
    let dataPerPage = this.state.dataPerPage;
    let totalPage = Math.ceil(this.state.contacts.length / dataPerPage);

    if (pageNumber <= totalPage && pageNumber > 0) {
      this.setState({ lastPage: totalPage });
      let endIndex = pageNumber * dataPerPage;
      let startIndex = endIndex - dataPerPage;
      let totalData = this.state.contacts;
      let currentPageData = totalData.slice(startIndex, endIndex);

      this.setState({ currentPageData: currentPageData });

      this.setState({ currentPage: pageNumber });
    }
  }

  toggleModel() {
    this.setState({ isModelOpen: !this.state.isModelOpen });
  }

  handleSubmit(value) {
    this.setState({ isModelOpen: false });
    axios
      .post(apiUrl + "contact", value)
      .then((res) => {
        let previousContacts = [...this.state.contacts];
        previousContacts.push(res.data);
        this.setState({ contacts: previousContacts });
        //this.setState({ isModelOpen: false });
        //changes reflected on current page on the basis of response catching no need to fetch data again.
        let previouscurrentPageData = [...this.state.currentPageData];
        previouscurrentPageData.push(res.data);
        this.setState({ currentPageData: previouscurrentPageData });
        alert("Your Contacts list Added successfully");
      })
      .catch((err) => console.log(err));
  }

  handleDelete(contact) {
    console.log(contact);

    axios.delete(apiUrl + "contact/" + contact.id).then((res) => {
      if (res) {
        console.log(res);
        let newData = this.state.contacts.filter(
          (data) => data.id !== contact.id
        );
        this.setState({ contacts: newData }, () => {
          //changes reflected on current page on the basis of response catching no need to fetch data again.
          let newCurrentData = this.state.currentPageData.filter(
            (data) => data.id !== contact.id
          );
          this.setState({ currentPageData: newCurrentData });
          // alert("Selected contact data deletd successfully")
        });
      }
    });
  }

  handleChange(event) {
    this.setState({ searchInput: event.target.value }, () => {
      this.search();
    });
  }

  search() {
    let searchInput = this.state.searchInput;
    let totalData = this.state.contacts;
    let filteredData = totalData.filter((value) => {
      return (
        value.firstname.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.lastname.toLowerCase().includes(searchInput.toLowerCase()) ||
        value.email.toLowerCase().includes(searchInput.toLowerCase())
      );
    });
    this.setState({ currentPageData: filteredData });
    this.setState({ totalSearchResult: filteredData.length });
  }

  componentDidMount() {
    axios.get(apiUrl + "contact").then((res) => {
      this.setState({ contacts: res.data });
      this.handlePagination(1);
      this.setState({ isLoading: false });
    });
  }

  render() {
    const loading = () => {
      let isLoading = this.state.isLoading;
      if (isLoading) {
        return <RenderLoader />;
      } else {
        return <div></div>;
      }
    };

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
              <td onClick={() => this.handleDelete(contact)}>
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
      if (this.state.currentPage === 1) {
        return (
          <Pagination aria-label="Page navigation example">
            <Link to={`/pages/${1}`}>
              <PaginationItem onClick={() => this.handlePagination(1)}>
                <PaginationLink first />
              </PaginationItem>
            </Link>
            <Link to={`/pages/${1}`}>
              <PaginationItem
                disabled
                onClick={() => this.handlePagination(this.state.currentPage)}
              >
                <PaginationLink previous />
              </PaginationItem>
            </Link>
            <Link to={`/pages/${this.state.currentPage}`}>
              <PaginationItem
                active
                onClick={() => this.handlePagination(this.state.currentPage)}
              >
                <PaginationLink>{this.state.currentPage}</PaginationLink>
              </PaginationItem>
            </Link>
            <Link to={`/pages/${this.state.currentPage + 1}`}>
              <PaginationItem
                onClick={() =>
                  this.handlePagination(this.state.currentPage + 1)
                }
              >
                <PaginationLink next />
              </PaginationItem>
            </Link>
            <Link to={`/pages/${this.state.lastPage}`}>
              <PaginationItem
                onClick={() => this.handlePagination(this.state.lastPage)}
              >
                <PaginationLink last />
              </PaginationItem>
            </Link>
          </Pagination>
        );
      } else if (this.state.currentPage === this.state.lastPage) {
        return (
          <Pagination aria-label="Page navigation example">
            <Link to={`/pages/${1}`}>
              <PaginationItem onClick={() => this.handlePagination(1)}>
                <PaginationLink first />
              </PaginationItem>
            </Link>
            <Link to={`/pages/${this.state.currentPage - 1}`}>
              <PaginationItem
                onClick={() =>
                  this.handlePagination(this.state.currentPage - 1)
                }
              >
                <PaginationLink previous />
              </PaginationItem>
            </Link>
            <Link to={`/pages/${this.state.currentPage}`}>
              <PaginationItem
                active
                onClick={() => this.handlePagination(this.state.currentPage)}
              >
                <PaginationLink>{this.state.currentPage}</PaginationLink>
              </PaginationItem>
            </Link>
            <Link to={`/pages/${this.state.currentPage}`}>
              <PaginationItem
                disabled
                onClick={() => this.handlePagination(this.state.currentPage)}
              >
                <PaginationLink next />
              </PaginationItem>
            </Link>
            <Link to={`/pages/${this.state.lastPage}`}>
              <PaginationItem
                onClick={() => this.handlePagination(this.state.lastPage)}
              >
                <PaginationLink last />
              </PaginationItem>
            </Link>
          </Pagination>
        );
      } else {
        return (
          <Pagination aria-label="Page navigation example">
            <Link to={`/pages/${1}`}>
              <PaginationItem onClick={() => this.handlePagination(1)}>
                <PaginationLink first />
              </PaginationItem>
            </Link>
            <Link to={`/pages/${parseInt(this.props.match.params.id) - 1}`}>
              <PaginationItem
                onClick={() =>
                  this.handlePagination(
                    parseInt(this.props.match.params.id) - 1
                  )
                }
              >
                <PaginationLink previous />
              </PaginationItem>
            </Link>
            <Link to={`/pages/${parseInt(this.props.match.params.id)}`}>
              <PaginationItem
                active
                onClick={() =>
                  this.handlePagination(parseInt(this.props.match.params.id))
                }
              >
                <PaginationLink>
                  {parseInt(this.props.match.params.id)}
                </PaginationLink>
              </PaginationItem>
            </Link>
            <Link to={`/pages/${parseInt(this.props.match.params.id) + 1}`}>
              <PaginationItem
                onClick={() =>
                  this.handlePagination(
                    parseInt(this.props.match.params.id) + 1
                  )
                }
              >
                <PaginationLink next />
              </PaginationItem>
            </Link>
            <Link to={`/pages/${this.state.lastPage}`}>
              <PaginationItem
                onClick={() => this.handlePagination(this.state.lastPage)}
              >
                <PaginationLink last />
              </PaginationItem>
            </Link>
          </Pagination>
        );
      }
    };

    return (
      <div className="container">
        <div>
          <h2 className="text-center mt-1"> Contact List </h2>
          <Row>
            <Col>
              <div className="Pagination">{renderPagination()}</div>
            </Col>
            <Col>
              <FormGroup row>
                <Label for="serach" sm={2}>
                  <b style={{ color: "green" }}>Search </b>
                </Label>
                <Col>
                  <Input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Serach Here..."
                    value={this.state.searchInput}
                    onChange={this.handleChange}
                  />
                </Col>
              </FormGroup>
            </Col>

            <Col>
              <div className="text-right">
                <Button color="primary" onClick={this.toggleModel}>
                  <span>
                    <i className="fa fa-plus fa-lg" aria-hidden="true"></i> Add
                    Contact
                  </span>
                </Button>
              </div>
            </Col>
          </Row>
          <div>
            <Modal isOpen={this.state.isModelOpen} toggle={this.toggleModel}>
              <ModalHeader toggle={this.toggleModel}>
                <span className="fa fa-address-card fa-lg "></span> Contact
                Details Form
              </ModalHeader>
              <ModalBody>
                <LocalForm onSubmit={(value) => this.handleSubmit(value)}>
                  <Row>
                    <Col>
                      <Label htmlFor="firstname">First Name </Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Control.text
                        model=".firstname"
                        id="firstname"
                        name="firstname"
                        placeholder="First Name"
                        className="form-control"
                        validators={{
                          required,
                          minLength: minLength(3),
                          maxLength: maxLength(15),
                        }}
                      />
                      <Errors
                        className="text-danger"
                        model=".firstname"
                        show="touched"
                        messages={{
                          required: "Required / ",
                          minLength: "Must be greater than 2 characters",
                          maxLength: "Must be 15 characters or less",
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <Label htmlFor="lastname">Last Name </Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Control.text
                        model=".lastname"
                        id="lastname"
                        name="lastname"
                        placeholder="First Name"
                        className="form-control"
                        validators={{
                          required,
                          minLength: minLength(3),
                          maxLength: maxLength(15),
                        }}
                      />
                      <Errors
                        className="text-danger"
                        model=".lastname"
                        show="touched"
                        messages={{
                          required: "Required / ",
                          minLength: "Must be greater than 2 characters",
                          maxLength: "Must be 15 characters or less",
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <Label htmlFor="email">Email </Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Control.text
                        model=".email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        className="form-control"
                        validators={{
                          required,
                          validEmail,
                        }}
                      />
                      <Errors
                        className="text-danger"
                        model=".email"
                        show="touched"
                        messages={{
                          required: "Required / ",
                          validEmail: "Invalid Email Address",
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <Button color="primary">Submit </Button>
                    </Col>
                  </Row>
                </LocalForm>
              </ModalBody>
            </Modal>
          </div>
          <div>
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
              {loading()}
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
