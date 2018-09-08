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
         	<TextField placeholder="Enter a zip code." onChange={this.onChange}></TextField>
	      	<p>Cost:${this.state.value}</p>
	 </div>
      </div>
    );
  }
  async onChange(event){
    if(event.target.value.length==5){
    var form = new FormData()
    form.append('zipcode',event.target.value)
    const cost = await fetch("/api/getcost",
    {method:"POST",
    mode: 'same-origin',
    cache: 'default',
    body:form})
    .then(response => response.json())
    .then(myjson => this.setState({value:myjson['zipcode']}));
    }
  }
}
ReactDOM.render(
  (<div><App/></div>),
  document.getElementById('root')
);
