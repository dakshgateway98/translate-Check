import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Voice from './components/Voice';

const App = () => {
    return (
    <BrowserRouter>
      <div>
        
        <Switch>
          {/* <Route path="/chat/:name/:room" component={PractiseComp} />
          <Route path="/join" component={Join} />
          <Route path="/check" component={CheckBox} />
          <Route path="/review" component={Reviews} />
          <Route path="/location" component={Location} /> */}
          {/* <Route path="/map" component={MapBox} /> */}
      
          <Route path="/" component={Voice} />
          
        </Switch>
      </div>
    </BrowserRouter>
  );;
};

export default App;
