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
	var cost2D = Array();
	costArr.forEach( (x, ind) => {
		xArr = x.split(",");
		cost2D.push([Number.parseInt(xArr[1]),Number.parseInt(xArr[3])]);
	});
	console.log(cost2D);
	truncCost2D = Array();
	// make medians
	for(var i = cost2D.length-1; i >= 2; i-=3) {
		let a = Array();
		for(var j = 0; j < 3; j++) {
			a.push(cost2D[i-j][1]);
		}
		a.sort();
		truncCost2D.push([cost2D[i][0], a[2]]);
	}
	console.log(truncCost2D);
	var reg = [
		regression.linear(truncCost2D, {precision: 4}),
//		regression.exponential(cost2D, {precision: 4})
	//	regression.polynomial(cost2D, {precision: 4})
	]
	console.log(reg[0])
	var r2 = -1;
	var indx = 0;
	for(var i = 0; i < reg.length; i++) {
		if(r2 < reg[i].r2) {
			indx = i;
			r2 = reg[i].r2;
		}
	}
	var bestReg;
	console.log(indx)
	var bestRegEq=reg[indx].equation
	console.log(bestRegEq)
	if(indx===0){
		bestReg=String(bestRegEq[0])+"x"+String(bestRegEq[1])
	}
	if(indx===1){
		bestReg=String(bestRegEq[0])+"e^("+String(bestRegEq[1])+"x)"
	}
	if(indx===2){
		bestReg = new polynomial(reg[indx].equation).toString();
	}
	integrated = math.integral(bestReg, 'x');
	fin = math.simplify(integrated, {x: 2048});
	init = math.simplify(integrated, {x: 2018});
	cost = fin - init;
	console.log(cost)
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
	var adjCost = 0;
	console.log("houseValue = " + houseValue);
	if(houseValue == 0) {
		adjCost = perCapita * 0.40; 
	}else if(houseValue == 1) {
		adjCost = perCapita;
	}else {
		adjCost = perCapita * 2.00;
	}
	return {cost:adjCost};
};

var saved = function(location, c) {
	var state = location.state;
	var price = c.cost;
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
	var premium = Math.round(pTotal,2);
	var cost = Math.round(price,2);
	var newCost = Math.round(pTotal + 0.10*price,2);
	prices = {
		premium: premium,
		cost: cost,
		newCost: newCost,
		netSaved: cost-newCost
	};
	console.log(prices);
	return prices;
}

var episodes = function(location) {
	var state = location.state;
	var county = location.county;
	if(county === ""){
		county = location.city;
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
		incidents: Math.round(incidents),
		trend: trend,
		forecast: Math.round(forecast)
	};
	return countyStats;
};

var locator = function(zipCode) {
	var zipLine=String(zipData).split("\r\n").filter((x)=>new RegExp(zipCode+".*").test(x))[0]
	if(!zipLine) {
		return "Location Not Found";
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
		if(location=="Location Not Found"){
			return -1
		}
		var episode = episodes(location);
		var cost = costs(location, houseValue);
		var prices = saved(location, cost);
		return Object.assign(episode, prices, location); 
	}
};
