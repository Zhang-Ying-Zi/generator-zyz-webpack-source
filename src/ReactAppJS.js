import * as React from "react";

class App extends React.Component {
  render() {
    const { name } = this.props;
    return (
      <>
        <h3>{name} JS Parsed!</h3>
      </>
    );
  }
}

export default App;
