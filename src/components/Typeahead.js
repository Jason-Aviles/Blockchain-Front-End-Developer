import React, { Component } from "react";

import PropTypes from "prop-types";


import AutoComplete from "./AutoComplete";
export default class componentName extends Component {
  state = {
    input: "",
    data: [],
    clickedInput: false,
    showSuggestions: false,
  };

  //completed PropType Checking
  static propTypes = {
    colorsList: PropTypes.arrayOf(PropTypes.string),
  };

  componentDidMount() {
    this.setState({ clickedInput: this.state });
  }

  onInputHandle = (e) => {
    this.setState({ [e.target.name]: e.target.value, clickedInput: false });
  };

  render() {
//regex to make the typed in letter show up bold in each word
    const boldLetters = (str, substr) => {
      let strRegExp = new RegExp(substr, "ig");
      return str.replace(strRegExp, substr.bold());
    };


    //change the state of showSuggestion 
    const updateSuggestion = (item) => {
      this.setState({ showSuggestions: item });
    };



    return (
      <div
        onClick={(e) => {
          if (e.target !== e.currentTarget) {
            return updateSuggestion(true);
          } else {
            return updateSuggestion(false);
          }
        }}
        className="main"
      >
        <h1 className="header">Type Ahead</h1>
   
        <AutoComplete
          showSuggestions={this.state.showSuggestions}
          boldLetters={boldLetters}
          suggestions={this.props.colorsList}
          updateSuggestion={updateSuggestion}
        />
       
      </div>
    );
  }
}
