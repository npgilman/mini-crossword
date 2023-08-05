import './App.css';
import CrosswarNav from './components/CrosswarNav.js';
import Grid from './components/Grid.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <CrosswarNav />
        <h1>CrossWar</h1>
        {/* 'Grid' component contains the crossword grid and status board */}
        <Grid />
      </header>
    </div>
  );
}

export default App;
