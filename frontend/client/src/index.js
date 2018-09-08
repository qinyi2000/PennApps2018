import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Materialize from 'materialize-css'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state=({value:"Fill in the form first.",zip:"", homesize:-1});
    this.onChange=this.onChange.bind(this)
  }

  render() {
      return (
      <div>
         <center>
	      <form ref={el => (this.form = el)}>
         	Enter your zip code:<TextField placeholder="" name="zipcode" onChange={(event)=>this.setState({zip:event.target.value})} type="number"></TextField><br/>
         	Enter the size range of your home in square feet:<Select name="homeprice" onChange={(event)=>{this.setState({homesize:event.target.value})}} value={-1}>
	        	<MenuItem value={-1}></MenuItem>
			<MenuItem value={0}>{"<2500"}</MenuItem>
	      		<MenuItem value={1}>{"2500-5000"}</MenuItem>
	      		<MenuItem value={2}>{">5000"}</MenuItem></Select><br/><br/>
	        <Button variant="raised" onClick={this.onChange} color="primary" disabled={this.state.zip.length!=5 || this.state.homesize==-1}>Calculate Your Cost</Button>
	      	<p>Cost:{this.state.value}</p>
	      </form>
	 </center>
      </div>
    );
  }
  async onChange(event){
    var form = new FormData(this.form)
    this.setState({value:"Loading..."})
    await fetch("/api/getcost",
    {method:"POST",
    mode: 'same-origin',
    cache: 'default',
    body:form})
    .then(response => response.json())
    .then(myjson => this.setState({value:"$"+myjson['zipcode']}));
  }
}
ReactDOM.render(
  (<div><App/></div>),
  document.getElementById('root')
);
