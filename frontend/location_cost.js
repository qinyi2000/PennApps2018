fs = require('fs');
zipData = fs.readFileSync("db/uszipsv1.2.csv");

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

var county_incidents = function(zipCode) {
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
	}
//	return location;
	console.log(location)
}
county_incidents(58341)
