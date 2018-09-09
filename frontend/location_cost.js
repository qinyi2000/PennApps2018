fs = require('fs');
zipData = fs.readFileSync("db/uszipsv1.2.csv");
countyData = fs.readFileSync("db/costsheets/NOAA.csv");
stateData = fs.readFileSync("db/costsheets/NFIP.csv");
populations = fs.readFileSync("db/costsheets/State_Populations.csv");
premiums = fs.readFileSync("db/costsheets/premiums.csv");
math = require('math');
regression = require('regression');
math = require('mathjs');
polynomial = require("polynomial")
math.import(require('mathjs-simple-integral'));

state_abbr = {
	'AL' : 'Alabama',
	'AK' : 'Alaska',
	'AS' : 'America Samoa',
	'AZ' : 'Arizona',
	'AR' : 'Arkansas',
	'CA' : 'California',
	'CO' : 'Colorado',
	'CT' : 'Connecticut',
	'DE' : 'Delaware',
	'DC' : 'District of Columbia',
	'FM' : 'Micronesia',
	'FL' : 'Florida',
	'GA' : 'Georgia',
	'GU' : 'Guam',
	'HI' : 'Hawaii',
	'ID' : 'Idaho',
	'IL' : 'Illinois',
	'IN' : 'Indiana',
	'IA' : 'Iowa',
	'KS' : 'Kansas',
	'KY' : 'Kentucky',
	'LA' : 'Louisiana',
	'ME' : 'Maine',
	'MH' : 'Marshall Islands',
	'MD' : 'Maryland',
	'MA' : 'Massachusetts',
	'MI' : 'Michigan',
	'MN' : 'Minnesota',
	'MS' : 'Mississippi',
	'MO' : 'Missouri',
	'MT' : 'Montana',
	'NE' : 'Nebraska',
	'NV' : 'Nevada',
	'NH' : 'New Hampshire',
	'NJ' : 'New Jersey',
	'NM' : 'New Mexico',
	'NY' : 'New York',
	'NC' : 'North Carolina',
	'ND' : 'North Dakota',
	'OH' : 'Ohio',
	'OK' : 'Oklahoma',
	'OR' : 'Oregon',
	'PW' : 'Palau',
	'PA' : 'Pennsylvania',
	'PR' : 'Puerto Rico',
	'RI' : 'Rhode Island',
	'SC' : 'South Carolina',
	'SD' : 'South Dakota',
	'TN' : 'Tennessee',
	'TX' : 'Texas',
	'UT' : 'Utah',
	'VT' : 'Vermont',
	'VI' : 'Virgin Island',
	'VA' : 'Virginia',
	'WA' : 'Washington',
	'WV' : 'West Virginia',
	'WI' : 'Wisconsin',
	'WY' : 'Wyoming'
}

var costs = function(location, houseValue) {
	var state = location.state;
	var costArr = String(stateData).split("\n").filter( (x) => {
		try {
			return x.includes(state) && !x.includes("NA"); 
		} catch(e) {
			return false;
		}
	});
	//console.log(costArr);
	var cost2D = costArr.map( (x, ind) => {
		xArr = x.split(",");
		return [Number.parseInt(xArr[1]),Number.parseInt(xArr[3])];
	});
	var reg = [
		regression.linear(cost2D, {precision: 4}),
		regression.exponential(cost2D, {precision: 4}),
		regression.polynomial(cost2D, {precision: 4})
	]
	var r2 = 0;
	var indx = -1;
	for(var i = 0; i < reg.length; i++) {
		if(r2 < reg[i].r2) {
			indx = i;
			r2 = reg[i].r2;
		}
	}
	var bestReg;
	var bestRegEq=reg[indx].equation
	if(indx==0){
		bestReg=String(bestRegEq[0])+"x"+String(bestRegEq[1])
	}
	if(indx==1){
		bestReg=String(bestRegEq[0])+"e^x"+String(bestRegEq[1])
	}
	if(indx==2){
		bestReg = new polynomial(reg[indx].equation).toString();
	}
	integrated = math.integral(bestReg, 'x');
	fin = math.simplify(integrated, {x: 2048});
	init = math.simplify(integrated, {x: 2018});
	cost = fin - init;
	pops = String(populations).split("\n").filter((x) => {
		try{
			parseInt(x.split(",")[0])
			return x.includes(state); 
		}
		catch(e){
			return false;
		}
	});
	var actualPop = parseInt(pops[0].split(",")[1]);
	var perCapita = cost * 1.0 / actualPop;
	//cost edit on house size
	if(houseValue == 0) {
		var adjCost = perCapita * 0.40; 
	}else if(houseValue == 1) {
		var adjCost = perCapita;
	}else {
		var adjCost = perCapita * 2.00;
	}
	return {cost:adjCost};
};

var saved = function(location, c, houseValue) {
	var state = location.state;
	var cost = c.cost;
	var prems = String(premiums).split("\n").filter( (x) => {
		try{
			parseInt(x.split(",")[0])
			return x.includes(state); 
		}
		catch(e){
			return false;
		}
	});
	premiumPrice = parseInt(prems[0].split(",")[2].substring(1)); //remove $ sign
	pTotal = premiumPrice * 30;
	return {
		premium: pTotal,
		cost: cost,
		newCost: pTotal + 0.10*cost,
		netSaved: cost-pTotal
	}
}

var episodes = function(location) {
	var state = location.state;
	var county = location.county;
	if(county==""){
		county=location.city
	}
	var disasters = String(countyData).split("\n").filter((x) => {
		try{
		parseInt(x.split(",")[0])
		return x.includes(state) && x.includes(county); 
		}
		catch(e){
			return false;
		}
	}
	);
	//console.log(disasters)
	var incidents = disasters.length;
	var oldDisasters = disasters.filter( (x) => Number.parseInt(x.split(",")[0], 10) <= 2006 ).length;
	var newDisasters = incidents - oldDisasters;
	var trend = newDisasters - oldDisasters;
	if(trend * 30./11 + newDisasters < 0) {
		trend = -newDisasters * 11./30;
	}
	var forecast = newDisasters * 30./11 + 1/2 * trend * 30./11;
	var countyStats = {
		incidents: incidents,
		trend: trend,
		forecast: forecast
	};
	return countyStats;
};

var locator = function(zipCode) {
	var zipLine=String(zipData).split("\r\n").filter((x)=>new RegExp(zipCode+".*").test(x))[0]
	if(!zipLine) {
		throw "Location Not Found";
	}
	//console.log(String(zipData).split("\r\n"))
	var zipArr = zipLine.split(",");

	var location = {
		zip: zipCode,
		city: zipArr[3],
		state: state_abbr[zipArr[4]],
		county: zipArr[8]
	};
	return location;
};

module.exports = {
	main : function(zipCode, houseValue){
		var location = locator(zipCode)
		var episode = episodes(location)
		var cost = costs(location)
		var prices = saved(location, cost, houseValue)
		return Object.assign(episode, prices, location) 
	}
};
