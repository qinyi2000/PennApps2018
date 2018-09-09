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
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink } from 'mdbreact';

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state=({value:"Fill in the form first.",zip:"", homesize:-1, value2:"", value3:""});
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
<Navbar color="indigo" dark expand="md" scrolling>
                    { !this.state.isWideEnough && <NavbarToggler onClick = { this.onClick } />}
                    <Collapse isOpen = { this.state.collapse } navbar>
                        <NavbarNav center>
	      		  <NavItem>
	      			<h1 style={{color:"white"}}>Flooding Cost Calculator</h1>
                          </NavItem>
                        </NavbarNav>
                    </Collapse>
                </Navbar>

	      <form ref={el => (this.form = el)}>
         	Enter your zip code:
          <TextFeld placeholder="" name="zipcode" onChange={(event)=>this.setState({zip:event.target.value})} type="number"></TextFeld><br/>
         	Enter the size range of your home in square feet:{this.renderSelect()}<br/><br/>
	        <Button variant="raised" onClick={this.onChange} color="primary" disabled={this.state.zip.length!=5 || this.state.homesize==-1}>Calculate Your Cost</Button>
	      {this.state.value.includes("Fill in")?(<p></p>):(<div>
		 <Card style={{width:"30vw"}} className="card">
		      <CardMedia><img src="/images/sample-1.jpg"></img></CardMedia>
		      <CardContent>{this.state.value}</CardContent>
		 </Card>   
		 <Card style={{width:"30vw", float:"left", top:"-30vh"}} className="card">
		      <CardMedia><img src="/images/sample-1.jpg"></img></CardMedia>
		      <CardContent>{this.state.value2}</CardContent>
		 </Card>     
		 <Card style={{width:"30vw", float:"right", top:"-30vh"}} className="card">
		      <CardMedia><img src="/images/sample-1.jpg"></img></CardMedia>
		      <CardContent>{this.state.value3}</CardContent>
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
    .then(myjson => this.setState({value:myjson['1'],value2:myjson['2'],value3:myjson['3']}));
  }
}
ReactDOM.render(
  (<div><App/></div>),
  document.getElementById('root')
);
