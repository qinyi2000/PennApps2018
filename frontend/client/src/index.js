import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import Button from '@material-ui/core/Button';
import TextFeld from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state=({value:"Fill in the form first.",zip:"", homesize:-1});
    this.renderSelect=this.renderSelect.bind(this)
    this.onChange=this.onChange.bind(this)
    this.onNewSelect=this.onNewSelect.bind(this)
  }

  onNewSelect(event){
   this.setState({homesize:event.target.value})
  }

  renderSelect(){
	return(
			<Select name="homeprice" id="size" onChange={this.onNewSelect} value={this.state.homesize}>
                        <MenuItem value={-1}></MenuItem>
                        <MenuItem value={0}>{"<2500"}</MenuItem>
                        <MenuItem value={1}>{"2500-5000"}</MenuItem>
                        <MenuItem value={2}>{">5000"}</MenuItem></Select>
	);
  }

  render() {
	  const { classes } = this.props;
      return (
      <div>
         <center>
	      <form ref={el => (this.form = el)}>
         	Enter your zip code:
          <TextFeld placeholder="" name="zipcode" onChange={(event)=>this.setState({zip:event.target.value})} type="number"></TextFeld><br/>
         	Enter the size range of your home in square feet:{this.renderSelect()}<br/><br/>
	        <Button variant="raised" onClick={this.onChange} color="primary" disabled={this.state.zip.length!=5 || this.state.homesize==-1}>Calculate Your Cost</Button>
	      {this.state.value.includes("Fill in")?(<p></p>):(<div>
		 <Card style={{width:"30vw"}}>
		      <CardMedia><img src="/images/sample-1.jpg"></img></CardMedia>
		      <CardContent>{this.state.value}</CardContent>
		 </Card>     
  </div>)}
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
    .then(myjson => this.setState({value:myjson['1']}));
  }
}
ReactDOM.render(
  (<div><App/></div>),
  document.getElementById('root')
);
