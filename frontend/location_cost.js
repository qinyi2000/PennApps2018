fs = require('fs');
zipData = fs.readFileSync("db/uszipsv1.2.csv");
countyData = fs.readFileSync("db/costsheets/NOAA.csv");
stateData = fs.readFileSync("db/costsheets/NFIP.csv");
import regression from 'regression';
math = require('math');
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

var costs = function(location) {
	var state = location.state;
	var trend = episodes.trend;
	var costArr = String(stateData).split("\n").filter( (x) => {
		try {
			parseInt(x.split(",")[0]);
			return x.includes(state);
		} catch(e) {
			return false;
		}
	});
	console.log(costArr);
	var cost2D = costArr.forEach( (x) => {
		xArr = x.split(",");
		return [xArr[1],xArr[3]];
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
	bestReg = reg[indx];
	integrated = math.integral(bestReg, 'x');
	fin = math.simplify(integrated, {x: 2048});
	init = math.simplify(integrated, {x: 2018});
	cost = fin - init;
	return cost;
};

module.exports = {
	episodes : function(location) {
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
		console.log(disasters)
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
	},
	locator : function(zipCode) {
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
	}
};
