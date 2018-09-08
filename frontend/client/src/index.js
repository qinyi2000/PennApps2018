import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state=({value:""});
    this.onChange=this.onChange.bind(this)
  }

  render() {
      return (
      <div>
         <div>
	      <form>
         	<TextField placeholder="Enter a zip code." name="zipcode"></TextField>
         	<TextField placeholder="H" name=""></TextField>
	        <Button onClick={this.onChange}></Button>
	      	<p>Cost:${this.state.value}</p>
	      </form>
	 </div>
      </div>
    );
  }
  async onChange(event){
    var form = new FormData(event.target)
    const cost = await fetch("/api/getcost",
    {method:"POST",
    mode: 'same-origin',
    cache: 'default',
    body:form})
    .then(response => response.json())
    .then(myjson => this.setState({value:myjson['zipcode']}));
  }
}
ReactDOM.render(
  (<div><App/></div>),
  document.getElementById('root')
);
