import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array),
  };

  static defaultProps = {
    suggestions: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],

      // What the user has entered
      userInput: "",

      // What the user has pressed on the keys
      keys: "",
    };

    this.resultsDiv = React.createRef();
  }

  onChange = (e) => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    this.props.updateSuggestion(true);
    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,

      userInput: e.currentTarget.value,
    });
  };

  // Event fired when the user clicks on a suggestion
  onClick = (e) => {
    this.props.updateSuggestion(false);
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],

      userInput: e.currentTarget.innerText,
    });
  };

  // Event fired when the user presses a key down
  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    let elmnt = document.getElementById("Div");
    const scrollToBottom = () => {
      if (!elmnt) return;

      elmnt.scrollIntoView(false);
      elmnt.scrollTop += 114; // Bottom
    };

    const scrollToTop = () => {
      if (!elmnt) return;
      elmnt.scrollIntoView(true);
      elmnt.scrollTop -= 114; // Top
    };

    // User pressed the enter key, update the input and close the
    // suggestions

    if (e.keyCode === 13) {
      this.setState({ keys: "Enter" });
      this.props.updateSuggestion(false);
      this.setState({
        userInput: filteredSuggestions[activeSuggestion],
      });
    }

    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      this.setState({ keys: "Up Arrow" });

      if ((activeSuggestion + 1) % 3 === 0) scrollToTop();
      if (activeSuggestion === 0) {
        return this.props.updateSuggestion(false);
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      this.setState({ keys: "Down Arrow" });
      //scroll every 3 index
      if ((activeSuggestion + 1) % 3 === 0) scrollToBottom();

      if (activeSuggestion === filteredSuggestions.length - 1) {
        return this.props.updateSuggestion(false);
      }

      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }

    // User pressed the down tab and not shift , increment the index
    else if (e.keyCode === 9 && !e.shiftKey) {
      e.preventDefault();

      this.setState({ keys: "Tab" });
      //scroll every 3 index
      if ((activeSuggestion + 1) % 3 === 0) scrollToBottom();

      if (activeSuggestion === filteredSuggestions.length - 1) {
        return this.props.updateSuggestion(false);
      }

      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }

    // User pressed the tab and shift , decrement the index
    else if (e.keyCode === 9 && e.shiftKey) {
      e.preventDefault();
      this.setState({ keys: "Tab + Shift" });
      //scroll every 3 index
      if ((activeSuggestion + 1) % 3 === 0) scrollToTop();

      if (activeSuggestion === 0) {
        return this.props.updateSuggestion(false);
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }

    // User pressed the esc key, update the input and close the
    // suggestions
    else if (e.keyCode === 27) {
      this.setState({ keys: "Esc" });

      return this.props.updateSuggestion(false);
    } else if (!e.keyCode) {
      this.setState({
        keys: "Invliad key",
      });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: { activeSuggestion, filteredSuggestions, userInput },
    } = this;

    let suggestionsListComponent;

    if (this.props.showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <div>
            <ul id="Div" class="suggestions" ref={this.resultsDiv}>
              {filteredSuggestions.map((suggestion, index) => {
                let className;

                // Flag the active suggestion with a class
                if (index === activeSuggestion) {
                  className = "suggestion-active";
                }

                return (
                  <li
                    className={className}
                    key={suggestion}
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: this.props.boldLetters(
                          suggestion,
                          this.state.userInput
                        ),
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        );
      } else {
        suggestionsListComponent = (
          <div class="no-suggestions">
            <em>No suggestions, you're on your own!</em>
          </div>
        );
      }
    }

    return (
      <Fragment>
        <div className="form__group">
          <div className="form__group__title">
            <h3 className="colorLength">
              You found: {filteredSuggestions.length} matches{" "}
            </h3>
            <h1 className="pushKeys">
              {this.state.keys
                ? this.state.keys
                : "Press a key: UpArrow DownArrow Tab Tab+Shift"}
            </h1>
          </div>

          {filteredSuggestions.length > 0 ? (
            <label htmlFor="search" className="label">
              <i class="fab fa-searchengin"></i> Searching...
            </label>
          ) : null}
          <input
            placeholder="search...."
            type="text"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
          />
          {suggestionsListComponent}
          <div className="content">
            {
              <div
                style={{ background: !userInput ? "transparent" : userInput }}
                className="content__items"
              >
                <h2 className="content__text">
                  {userInput} <i class="fas fa-paint-brush"></i>
                </h2>
              </div>
            }
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Autocomplete;
