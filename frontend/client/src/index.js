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
         <center>
	      <form ref={el => (this.form = el)}>
         	Enter your zip code:<TextField placeholder="" name="zipcode"></TextField><br/>
         	Enter the price of your house:$<TextField placeholder="" name="homeprice"></TextField><br/>
	        <Button variant="raised" onClick={this.onChange} color="primary">Calculate Your Cost</Button>
	      	<p>Cost:${this.state.value}</p>
	      </form>
	 </center>
      </div>
    );
  }
  async onChange(event){
    var form = new FormData(this.form)
    await fetch("/api/getcost",
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
