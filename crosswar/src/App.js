import './App.css';
import Grid from './components/Grid.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>CrossWar</h1>
        {/* 'Grid' component contains the crossword grid and status board */}
        <Grid />
      </header>
    </div>
  );
}

export default App;
