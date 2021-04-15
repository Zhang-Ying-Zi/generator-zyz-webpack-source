import * as React from 'react';

interface Props {
   name: string
}

class App extends React.Component<Props> {
  render() {
    const { name } = this.props;
    return (
      <>
        <h3>
          {name} Parsed!
        </h3>
      </>
    );
  }
}

export default App;