/* Data adapted from https://www.fema.gov/media-library-data/1499290622913-0bcd74f47bf20aa94998a5a920837710/Flood_Loss_Estimations_2017.pdf */

var get_cost = function(depth, houseSize) {
	return cost[houseSize][depth];
};

var cost = [
	[
		[1, 10819],
		[2, 10889],
		[3, 11790],
	],
	[
		[1, 26907],
		[2, 26892]
	]
	[
		[1, 53454],
		[2, 53564],
		[3, 58448],
	]
]