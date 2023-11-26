const marketLimit = 200;

const currentSettingsToUrl = function() {
	let params = [];
	for (let entryField of Object.values(allSettingsData)) {
		if (entryField.currentValue !== entryField.defaultValue) {
			params.push(entryField.settingId + "=" +  encodeURIComponent(entryField.currentValue));
		}
	}
	let str = window.location.origin + window.location.pathname;
	return params.length > 0 ? str + "?" + params.join("&") : str;
}

//Array randomizer. Shuffles in place.
const shuffle = function(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
}

const searchResultsTitleBar = document.getElementById("searchResultsTitleBar");

let visualProbability = false;
document.getElementById("visibilityOptions").addEventListener("input", function() {
	updateVisibilityOptions();
	uiControlFlow("visibilityChanged");
});

const tiebreakerComparisonFunction = function(result, a, b) {
	if (result !== 0) {
		return result;
	}
	if (a.normalizedQuestion === b.normalizedQuestion) {
		return 0;
	}
	if (a.normalizedQuestion > b.normalizedQuestion) {
		return 1;
	} else {
		return -1;
	}
}

//The settingId, object key, and element ID in the HTML are all the same.
const allSettingsData = {
	"volumeWeight": {
		"type": "sortingWeight",
		"settingId": "volumeWeight",
		"humanReadableName": "Volume",
		"currentValue": 0,
		"sortingFunction": function(markets, weight) {
			foo = 0, bar = 0;
			const valueIfUndefined = weight > 0 ? 1 : 999999999999;
			markets.sort(function(a, b) {
				return tiebreakerComparisonFunction((b.hasOwnProperty("volume") ? b.volume : valueIfUndefined) - (a.hasOwnProperty("volume") ? a.volume : valueIfUndefined), a, b);
			});
		},
		"defaultValue": 0,
	},
	"volume24HoursWeight": {
		"type": "sortingWeight",
		"settingId": "volume24HoursWeight",
		"humanReadableName": "24 hour volume",
		"currentValue": 0,
		"sortingFunction": function(markets, weight) {
			foo = 0, bar = 0;
			const valueIfUndefined = weight > 0 ? 1 : 999999999999;
			markets.sort(function(a, b) {
				return tiebreakerComparisonFunction((b.hasOwnProperty("volume24Hours") ? b.volume24Hours : valueIfUndefined) - (a.hasOwnProperty("volume24Hours") ? a.volume24Hours : valueIfUndefined), a, b);
			});
		},
		"defaultValue": 0,
	},
	"totalTradersWeight": {
		"type": "sortingWeight",
		"settingId": "totalTradersWeight",
		"humanReadableName": "Total traders",
		"currentValue": 0,
		"sortingFunction": function(markets, weight) {
			foo = 0, bar = 0;
			const valueIfUndefined = weight > 0 ? 1 : 999999999999;
			markets.sort(function(a, b) {
				return tiebreakerComparisonFunction((b.hasOwnProperty("totalTraders") ? b.totalTraders : valueIfUndefined) - (a.hasOwnProperty("totalTraders") ? a.totalTraders : valueIfUndefined), a, b);
			});
		},
		"defaultValue": 0,
	},
	"liquidityWeight": {
		"type": "sortingWeight",
		"settingId": "liquidityWeight",
		"humanReadableName": "Liquidity",
		"currentValue": 1,
		"sortingFunction": function(markets, weight) {
			foo = 0, bar = 0;
			const valueIfUndefined = weight > 0 ? 1 : 999999999999;
			markets.sort(function(a, b) {
				return tiebreakerComparisonFunction((b.hasOwnProperty("liquidity") ? b.liquidity : valueIfUndefined) - (a.hasOwnProperty("liquidity") ? a.liquidity : valueIfUndefined), a, b);
			});
		},
		"defaultValue": 1,
	},
	"closeTimeWeight": {
		"type": "sortingWeight",
		"settingId": "closeTimeWeight",
		"humanReadableName": "Close time",
		"currentValue": 0,
		"sortingFunction": function(markets, weight) {
			const valueIfUndefined = weight > 0 ? 8640000000000000 : -8640000000000000;
			markets.sort(function(a, b) {
				return tiebreakerComparisonFunction((a.hasOwnProperty("closeTime") ? a.closeTime : valueIfUndefined) - (b.hasOwnProperty("closeTime") ? b.closeTime : valueIfUndefined), a, b);
			});
		},
		"defaultValue": 0,
	},
	"createdTimeWeight": {
		"type": "sortingWeight",
		"settingId": "createdTimeWeight",
		"humanReadableName": "Created time",
		"currentValue": 0,
		"sortingFunction": function(markets, weight) {
			const valueIfUndefined = weight > 0 ? -8640000000000000 : 8640000000000000;
			markets.sort(function(a, b) {
				return tiebreakerComparisonFunction((b.hasOwnProperty("createdTime") ? b.createdTime : valueIfUndefined) - (a.hasOwnProperty("createdTime") ? a.createdTime : valueIfUndefined), a, b);
			});
		},
		"defaultValue": 0,
	},
	"creatorWeight": {
		"type": "sortingWeight",
		"settingId": "creatorWeight",
		"humanReadableName": "Creator",
		"currentValue": 0,
		"sortingFunction": function(markets, weight) {
			markets.sort(function(a, b) {
				let result = 0;
				if (a.creatorUsername > b.creatorUsername) {
					result = 1;
				}
				if (a.creatorUsername < b.creatorUsername) {
					result = -1;
				}
				return tiebreakerComparisonFunction(result, a, b);
			});
		},
		"defaultValue": 0,
	},
	"probabilityWeight": {
		"type": "sortingWeight",
		"settingId": "probabilityWeight",
		"humanReadableName": "Probability",
		"currentValue": 0,
		"sortingFunction": function(markets, weight) {
			const valueIfUndefined = weight > 0 ? 0 : 0.5;
			markets.sort(function(a, b) {
				const aEffectiveProb = a.hasOwnProperty("probability") ? a.probability : valueIfUndefined;
				const bEffectiveProb = b.hasOwnProperty("probability") ? b.probability : valueIfUndefined;
				return tiebreakerComparisonFunction(Math.abs(0.5 - aEffectiveProb) - Math.abs(0.5 - bEffectiveProb), a, b);
			});
		},
		"defaultValue": 0,
	},
	"numGroupsWeight": {
		"type": "sortingWeight",
		"settingId": "numGroupsWeight",
		"humanReadableName": "Number of groups",
		"currentValue": 0,
		"sortingFunction": function(markets, weight) {
			markets.sort(function(a, b) {
				return tiebreakerComparisonFunction(a.groups.length - b.groups.length, a, b);
			});
		},
		"defaultValue": 0,
	},
	"randomWeight": {
		"type": "sortingWeight",
		"settingId": "randomWeight",
		"humanReadableName": "Random",
		"currentValue": 0,
		"sortingFunction": function(markets, weight) {
			shuffle(markets);
		},
		"defaultValue": 0,
	},
	"lastUpdatedTimeWeight": {
		"type": "sortingWeight",
		"settingId": "lastUpdatedTimeWeight",
		"humanReadableName": "Last updated",
		"currentValue": 0,
		"sortingFunction": function(markets, weight) {
			const valueIfUndefined = weight > 0 ? 8640000000000000 : -8640000000000000;
			markets.sort(function(a, b) {
				return tiebreakerComparisonFunction((a.hasOwnProperty("lastUpdatedTime") ? a.lastUpdatedTime : valueIfUndefined) - (b.hasOwnProperty("lastUpdatedTime") ? b.lastUpdatedTime : valueIfUndefined), a, b);
			});
		},
		"defaultValue": 0,
	},
	"questionVisibility": {
		"type": "visibilityOption",
		"settingId": "questionVisibility",
		"humanReadableName": "Question",
		"currentValue": true,
		"defaultValue": true,
	},
	"descriptionVisibility": {
		"type": "visibilityOption",
		"settingId": "descriptionVisibility",
		"humanReadableName": "Description",
		"columnWidth": 40,
		"currentValue": false,
		"defaultValue": false,
	},
	"groupsVisibility": {
		"type": "visibilityOption",
		"settingId": "groupsVisibility",
		"humanReadableName": "Groups",
		"columnWidth": 15,
		"currentValue": false,
		"defaultValue": false,
		"associatedSortingWeight": "numGroupsWeight",
	},
	"creatorVisibility": {
		"type": "visibilityOption",
		"settingId": "creatorVisibility",
		"humanReadableName": "Creator",
		"columnWidth": 8,
		"currentValue": false,
		"defaultValue": false,
		"associatedSortingWeight": "creatorWeight",
	},
	"closeTimeVisibility": {
		"type": "visibilityOption",
		"settingId": "closeTimeVisibility",
		"humanReadableName": "Close time",
		"columnWidth": 6.8,
		"currentValue": true,
		"defaultValue": true,
		"associatedSortingWeight": "closeTimeWeight",
	},
	"liquidityVisibility": {
		"type": "visibilityOption",
		"settingId": "liquidityVisibility",
		"humanReadableName": "Liquidity",
		"columnWidth": 4,
		"currentValue": true,
		"defaultValue": true,
		"associatedSortingWeight": "liquidityWeight",
	},
	"volumeVisibility": {
		"type": "visibilityOption",
		"settingId": "volumeVisibility",
		"humanReadableName": "Volume",
		"columnWidth": 5,
		"currentValue": false,
		"defaultValue": false,
		"associatedSortingWeight": "volumeWeight",
	},
	"volume24HoursVisibility": {
		"type": "visibilityOption",
		"settingId": "volume24HoursVisibility",
		"humanReadableName": "24 hour volume",
		"columnWidth": 4,
		"currentValue": false,
		"defaultValue": false,
		"associatedSortingWeight": "volume24HoursWeight",
	},
	"totalTradersVisibility": {
		"type": "visibilityOption",
		"settingId": "totalTradersVisibility",
		"humanReadableName": "Total traders",
		"columnWidth": 3,
		"currentValue": false,
		"defaultValue": false,
		"associatedSortingWeight": "totalTradersWeight",
	},
	"lastUpdatedTimeVisibility": {
		"type": "visibilityOption",
		"settingId": "lastUpdatedTimeVisibility",
		"humanReadableName": "Last updated",
		"columnWidth": 6.5,
		"currentValue": false,
		"defaultValue": false,
		"associatedSortingWeight": "lastUpdatedTimeWeight",
	},
	"percentageVisibility": {
		"type": "visibilityOption",
		"settingId": "percentageVisibility",
		"humanReadableName": "Prob",
		"columnWidth": 3,
		"currentValue": true,
		"defaultValue": true,
		"associatedSortingWeight": "probabilityWeight",
	},
	"dashboardVisibility": {
		"type": "visibilityOption",
		"settingId": "dashboardVisibility",
		"humanReadableName": "Dash",
		"columnWidth": 5,
		"currentValue": false,
		"defaultValue": false,
	},
	"bettingVisibility": {
		"type": "visibilityOption",
		"settingId": "bettingVisibility",
		"humanReadableName": "Betting",
		"columnWidth": 17,
		"currentValue": false,
		"defaultValue": false,
	},
	"question": {
		"type": "searchOption",
		"settingId": "question",
		"inputFormat": "text",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "question",
	},
	"description": {
		"type": "searchOption",
		"settingId": "description",
		"inputFormat": "text",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "description",
	},
	"groups": {
		"type": "searchOption",
		"settingId": "groups",
		"inputFormat": "text",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "groups",
	},
	"type": {
		"type": "searchOption",
		"settingId": "type",
		"inputFormat": "text",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "type",
	},
	"answers": {
		"type": "searchOption",
		"settingId": "answers",
		"inputFormat": "text",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "answers",
	},
	"any": {
		"type": "searchOption",
		"settingId": "any",
		"inputFormat": "text",
		"currentValue": "",
		"defaultValue": "",
	},
	"creator": {
		"type": "searchOption",
		"settingId": "creator",
		"inputFormat": "text",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "creatorUsername",
	},
	"open": {
		"type": "searchOption",
		"settingId": "open",
		"inputFormat": "checkbox",
		"currentValue": true,
		"defaultValue": true,
	},
	"closed": {
		"type": "searchOption",
		"settingId": "closed",
		"inputFormat": "checkbox",
		"currentValue": false,
		"defaultValue": false,
	},
	"resolved": {
		"type": "searchOption",
		"settingId": "resolved",
		"inputFormat": "checkbox",
		"currentValue": false,
		"defaultValue": false,
	},
	"closeTime": {
		"type": "searchOption",
		"settingId": "closeTime",
		"inputFormat": "numericalRange",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "closeTime",
	},
	"createdTime": {
		"type": "searchOption",
		"settingId": "createdTime",
		"inputFormat": "numericalRange",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "createdTime",
	},
	"percentage": {
		"type": "searchOption",
		"settingId": "percentage",
		"inputFormat": "numericalRange",
		"currentValue": "",
		"defaultValue": "",
	},
	"liquidity": {
		"type": "searchOption",
		"settingId": "liquidity",
		"inputFormat": "numericalRange",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "liquidity",
	},
	"volume": {
		"type": "searchOption",
		"settingId": "volume",
		"inputFormat": "numericalRange",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "volume",
	},
	"volume24Hours": {
		"type": "searchOption",
		"settingId": "volume24Hours",
		"inputFormat": "numericalRange",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "volume24Hours",
	},
	"totalTraders": {
		"type": "searchOption",
		"settingId": "totalTraders",
		"inputFormat": "numericalRange",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "totalTraders",
	},
	"numGroups": {
		"type": "searchOption",
		"settingId": "numGroups",
		"inputFormat": "numericalRange",
		"currentValue": "",
		"defaultValue": "",
	},
	"lastUpdatedTime": {
		"type": "searchOption",
		"settingId": "lastUpdatedTime",
		"inputFormat": "numericalRange",
		"currentValue": "",
		"defaultValue": "",
		"marketProperty": "lastUpdatedTime",
	},
	"custom": {
		"type": "searchOption",
		"settingId": "custom",
		"inputFormat": "code",
		"currentValue": "",
		"defaultValue": "",
	},
	"dashboardCheckbox": {
		"type": "searchOption",
		"settingId": "dashboardCheckbox",
		"inputFormat": "checkbox",
		"currentValue": false,
		"defaultValue": false,
	},
}

for (let id in allSettingsData) {
	if (allSettingsData[id].defaultValue === true) {
		document.getElementById(id).checked = true;
	}
}

const updateSortingOptionValues = function() {
	const allSortingWeights = Object.values(allSettingsData).filter(field => field.type === "sortingWeight");
	for (let weight of allSortingWeights) {
		weight.currentValue = Number(document.getElementById(weight.settingId).value);
	}
};

//Weights is an object like {weightname: value}. Any that are not defined are set to 0.
const updateSortingOptionDisplay = function(weightObj) {
	const allSortingWeights = Object.values(allSettingsData).filter(field => field.type === "sortingWeight");
	let numArgsThatAre1 = 0;
	let argToUse = allSortingWeights.filter(weight => weight.defaultValue === 1)[0];
	for (let weight of allSortingWeights) {
		if (typeof weightObj[weight.settingId] === "number" && !Number.isNaN(weightObj[weight.settingId])) {
			weight.currentValue = weightObj[weight.settingId];
		} else {
			weight.currentValue = 0;
		}
		document.getElementById(weight.settingId).value = weight.currentValue;
		if (weight.currentValue === 1) {
			numArgsThatAre1++;
			argToUse = weight.settingId;
		}
	}
	if (numArgsThatAre1 === 1) {
		document.getElementById("sortOrder").value = allSettingsData[argToUse].humanReadableName;
		document.getElementById("mixingWeights").style.visibility = "hidden";
	} else {
		document.getElementById("sortOrder").value = "Mixed";
		document.getElementById("mixingWeights").style.visibility = "visible";
	}
}

let allMarketData = {},//Also stores a reference to a row element.
		allMarketArray = [],//This is Object.values(allMarketData), kept up to date any time allMarketData changes. Saves ~25ms on every search.
		currentMarketArray = [];//This is allMarketArray filtered down to the markets the user is currently looking at. (Includes markets over the display limit.)

let allMarketsSorted = true;

//This function handles all modification of the results table, and all modification of allMarketData, allMarketArray, and currentMarketArray.
const uiControlFlow = function(mode, markets) {
	const startTime = performance.now();
	if (markets && markets.length > 1 && !markets[0].normalizedQuestion) {
		throw new Error("Control flow markets not normalized.");
	}
	if (!["marketsChanged", "filtersChanged", "sortingChanged", "visibilityChanged"].includes(mode)) {
		throw new Error(`${mode} is not a valid control flow mode`);
	}

	if (mode === "marketsChanged") {

		for (let i = 0 ; i < markets.length ; i++) {
			const market = markets[i];

			if (!market.hasOwnProperty("type") || market.hasOwnProperty("isResolved") || market.type === "bugged") {//This can be deleted in a few weeks.
				markets.splice(i, 1);
				i--;
				continue;
			}

			if (allMarketData[market.id] === undefined) {
				allMarketData[market.id] = market;
			} else if (market.lastUpdatedTime > allMarketData[market.id].lastUpdatedTime) {
				market.elementRef = allMarketData[market.id].elementRef;
				allMarketData[market.id] = market;
				if (market.elementRef) {
					updateRow(market.elementRef, market);
				}
			}
		}

		if (markets.length > 0) {
			allMarketArray = Object.values(allMarketData);
			mixedSort(allMarketArray);
			allMarketsSorted = true;
			filterMarkets();
			if (lucky && currentMarketArray.length > 0) {
				window.location.href = marketUrl(currentMarketArray[0]);
			} else {
				displayRows();
			}
		}

		if (allRemoteMarketsLoaded) {
			saveMarketData();
		}
	}
	if (mode === "visibilityChanged") {
		updateCssForTableVisibility();
		for (let i = 0 ; i < currentMarketArray.length ; i++) {
			if (i >= marketLimit) {
				break;
			}
			const market = currentMarketArray[i];
			if (visualProbability) {
				if (market.probability) {
					market.elementRef.style.background = `linear-gradient(90deg, lightgreen ${Math.round(market.probability * 100)}%, lightpink 0)`;
				} else {
					market.elementRef.style.background = "lightgrey";
				}
			} else {
				market.elementRef.style.background = "";
			}
		}
	} else if (mode === "sortingChanged") {
		allMarketsSorted = false;
		mixedSort(currentMarketArray);
		displayRows();
	} else if (mode === "filtersChanged") {
		if (!allMarketsSorted) {
			mixedSort(allMarketArray);
			allMarketsSorted = true;
		}
		filterMarkets();
		displayRows();
	}

	history.replaceState({}, "", currentSettingsToUrl());

	//console.log(`In total, control flow took ${performance.now() - startTime}ms`);
	const postControlFlowTime = performance.now();
	setTimeout(function() {
		//console.log("Post-control-flow microtasks took " + (performance.now() - postControlFlowTime) + "ms");
	}, 0);
}

const updateCssForTableVisibility = function() {
	let styleString = "";
	for (let entryField of Object.values(allSettingsData)) {
		if (entryField.type === "visibilityOption") {
			if (!entryField.currentValue) {
				styleString += `.${entryField.settingId} {display:none}`;
			}
		}
	}

	styleString += ".row {grid-template-columns: ";
	for (let value in allSettingsData) {
		if (value === "questionVisibility") {
			styleString += "1fr ";
		} else if (allSettingsData[value].type === "visibilityOption" && allSettingsData[value].currentValue) {
			styleString += allSettingsData[value].columnWidth + "rem ";
		}
	}
	styleString += "}";

	const styles = document.getElementById("jsStyles");
	styles.innerHTML = styleString;
}
updateCssForTableVisibility();

let allLocalMarketsLoaded = false;

const updateVisibilityOptions = function() {
	visualProbability = document.getElementById("probabilityColor").checked;

	for (let entryField of Object.values(allSettingsData)) {
		if (entryField.type === "visibilityOption") {
			entryField.currentValue = document.getElementById(entryField.settingId).checked;
		}
	}
	allSettingsData.dashboardVisibility.currentValue ? document.getElementById("dashboardLabel").style.display = "inline" : document.getElementById("dashboardLabel").style.display = "none";
	allSettingsData.bettingVisibility.currentValue ? document.getElementById("apiKeyLabel").style.display = "inline" : document.getElementById("apiKeyLabel").style.display = "none";
}
updateVisibilityOptions();

let dashboard = [];//List of market IDs.
		dashboardOn = false;
if (localStorage.getItem("marketDashboard")) {
	dashboard = JSON.parse(localStorage.getItem("marketDashboard"));
}
document.getElementById("dashboardCheckbox").addEventListener("change", function() {
	dashboardOn = document.getElementById("dashboardCheckbox").checked;
	uiControlFlow("filtersChanged");
});

if (localStorage.getItem("manifoldApiKey")) {
	document.getElementById("apiKey").value = localStorage.getItem("manifoldApiKey");
}
document.getElementById("apiKey").addEventListener("change", function() {
	localStorage.setItem("manifoldApiKey", document.getElementById("apiKey").value);
})

const marketUrl = function(market) {
	if (market.slug && market.creatorUsername) {
		return `https://manifold.markets/${market.creatorUsername}/${market.slug}?r=SXNhYWNLaW5n`;
	} else {
		return market.url;
	}
}

const allGroups = new Set();
const allCreators = new Set();
const allTypes = new Set();
const createDatalists = function() {
	const oldGroupsSize = allGroups.size;
	const oldCreatorsSize = allCreators.size;
	const oldTypesSize = allTypes.size;

	for (let id in allMarketData) {
		for (let group of allMarketData[id].groups) {
			allGroups.add(group);
		}
		allCreators.add(allMarketData[id].creatorUsername);
		if (allMarketData[id].type) {
			allTypes.add(allMarketData[id].type);
		}
	}

	if (oldGroupsSize !== allGroups.size) {
		let groupOptions = "";
		const sortedGroups = Array.from(allGroups).sort();
		for (let group of sortedGroups) {
			groupOptions += "<option value=\"" + group + "\" />";
		}
		document.getElementById("groupsDatalist").innerHTML = groupOptions;
	}

	if (oldCreatorsSize !== allCreators.size) {
		let creatorOptions = "";
		const sortedCreators = Array.from(allCreators).sort();
		for (let creator of sortedCreators) {
			creatorOptions += "<option value=\"" + creator + "\" />";
		}
		document.getElementById("creatorDatalist").innerHTML = creatorOptions;
	}

	if (oldTypesSize !== allTypes.size) {
		let typeOptions = "";
		const sortedTypes = Array.from(allTypes).sort();
		for (let type of sortedTypes) {
			typeOptions += "<option value=\"" + type + "\" />";
		}
		document.getElementById("typeDatalist").innerHTML = typeOptions;
	}
}

const mixedSort = function(markets) {
	const startTime = performance.now();

	for (let market of markets) {
		market.totalSortingWeightIndex = 0;
	}
	//This sort takes vastly longer than the later one since it's doing string comparisons rather than number.
	for (weight of Object.values(allSettingsData)) {
		if (weight.type === "sortingWeight") {
			if (weight.currentValue !== 0) {
				weight.sortingFunction(markets, weight.currentValue);
				for (let i in markets) {
					markets[i].totalSortingWeightIndex += i * weight.currentValue;
				}
			}
		}
	}

	markets.sort(function(a, b) {
		return a.totalSortingWeightIndex - b.totalSortingWeightIndex;
	});

	for (market of markets) {
		delete market.totalSortingWeightIndex;
	}
	//console.log(`Sorted ${markets.length} markets in ${performance.now() - startTime}ms`)
}

//Takes in each chunk of loaded data and returns parsed markets in an array, with noramlized fields.
const internetLoadingWorker = new Worker("internetLoadingWorker.js");

const filterMarkets = function() {
	if (dashboardOn) {
		const marketIds = Object.keys(allMarketData);
		const dashboardMarkets = [];
		for (let id of marketIds) {
			if (dashboard.includes(id)) {
				dashboardMarkets.push(allMarketData[id]);
			}
		}
		return;
	}

	let markets = Array.from(allMarketArray);

	//We parse the inputs into objects for the search functions.
	const searchTerms = {};
	for (let entryField of Object.values(allSettingsData)) {
		if (entryField.type === "searchOption") {
			if (entryField.inputFormat === "text") {
				entryField.currentValue = document.getElementById(entryField.settingId).value;

				const elementTerms = searchTerms[entryField.settingId] = [];
				const result = extractQuotedSubstrings(entryField.currentValue);
				elementTerms.push(...result.quotedSubstrings.map(match => ({"type": "exact", "negated": match.negated, "string": match.string})));
				//Without the filter it'll search each field to make sure it matches the empty string from an empty input, which was very laggy.
				const words = result.remainingString.split(" ").filter(str => str.length > 0);
				elementTerms.push(...words.map(string => ({"type": "normalized", "negated": string.startsWith("-"), "string": normalizeString(string)})));
			} else if (entryField.inputFormat === "numericalRange") {
				entryField.currentValue = document.getElementById(entryField.settingId).value;

				const elementTerms = searchTerms[entryField.settingId] = [];
				//Without the filter it'll create an empty range.
				const ranges = entryField.currentValue.replaceAll(" ", "").replaceAll("%", "").split(",").filter(range => range !== "");
				for (let i in ranges) {
					if (ranges[i].includes("-")) {
						const subranges = ranges[i].split("-");
						if (["closeTime", "createdTime", "lastUpdatedTime"].includes(entryField.settingId)) {
							subranges[0] = convertHumanDateToTimestamp(subranges[0], entryField.settingId === "closeTime");
							subranges[1] = convertHumanDateToTimestamp(subranges[1], entryField.settingId === "closeTime");
						} else {
							subranges[0] = Number(subranges[0]);
							subranges[1] = Number(subranges[1]);
						}
						ranges[i] = {
							"min": subranges[0],
							"max": subranges[1],
						}
					} else {
						let num;
						if (["closeTime", "createdTime", "lastUpdatedTime"].includes(entryField.settingId)) {
							num = convertHumanDateToTimestamp(ranges[i], entryField.settingId === "closeTime");
						} else {
							num = Number(ranges[i]);
						}
						ranges[i] = {
							"min": num,
							"max": num,
						}
					}
				}
				if (entryField.settingId === "percentage") {
					for (let i in ranges) {
						ranges[i].min = ranges[i].min / 100;
						ranges[i].max = ranges[i].max / 100;
					}
				}
				elementTerms.push(...ranges);
			} else if (entryField.inputFormat === "checkbox") {
				entryField.currentValue = document.getElementById(entryField.settingId).checked;

				searchTerms[entryField.settingId] = entryField.currentValue;
			} else if (entryField.inputFormat === "code") {
				entryField.currentValue = document.getElementById(entryField.settingId).value;

				searchTerms[entryField.settingId] = entryField.currentValue;
			}
		}
	}


	if (!searchTerms.open) {
		markets = markets.filter(market => market.hasOwnProperty("closeTime") && market.closeTime < Date.now());
	}
	if (!searchTerms.closed) {
		markets = markets.filter(market => market.closeTime > Date.now() || market.resolution !== null);
	}
	if (!searchTerms.resolved) {
		markets = markets.filter(market => market.resolution === null);
	}

	const numericFilters = Object.values(allSettingsData).filter(setting => setting.type === "searchOption" && setting.inputFormat === "numericalRange").map(filter => filter.settingId);
	for (let settingId of numericFilters) {
		if (searchTerms[settingId] && searchTerms[settingId].length > 0) {
			if (settingId === "numGroups") {
				markets = markets.filter(function(market) {
					for (let numGroupsSearchTerm of searchTerms.numGroups) {
						if (market.groups.length < numGroupsSearchTerm.min || market.groups.length > numGroupsSearchTerm.max) {
							return false;
						}
					}
					return true;
				});
			} else {
				let settingName = settingId;
				if (settingId === "percentage") {
					settingName = "probability";
				}

				markets = markets.filter(function(market) {
					for (let elementSearchTerm of searchTerms[settingId]) {
						if (market[settingName] < elementSearchTerm.min || market[settingName] > elementSearchTerm.max) {
							return false;
						}
						if (!market.hasOwnProperty(settingName)) {
							return false;//Some markets don't have a close time or percentage, and those shouldn't show up in searches for those qualities.
						}
					}
					return true;
				});
			}
		}
	}

	const textSearchFieldSettings = Object.values(allSettingsData).filter(setting => setting.type === "searchOption" && setting.inputFormat === "text" && setting.marketProperty);
	for (let setting of textSearchFieldSettings) {
		for (let term of searchTerms[setting.settingId]) {
			if (typeof allMarketArray[0][setting.marketProperty] === "string") {
				//Most fields are just a single string on the market.
				if (term.type === "exact") {
					markets = markets.filter(market => market[setting.marketProperty].includes(term.string) === !term.negated);
				} else if (term.type === "normalized") {
					const normalizedPropName = "normalized" + setting.marketProperty[0].toUpperCase() + setting.marketProperty.slice(1);
					markets = markets.filter(market => (market[normalizedPropName] || normalizeString(market[setting.marketProperty])).includes(term.string) === !term.negated);
				}
			} else {
				//Groups and answers, which are arrays.
				if (term.type === "exact") {
					markets = markets.filter(function(market) {
						return market[setting.marketProperty].some(item => item.includes(term.string)) === !term.negated;
					});
				} else if (term.type === "normalized") {
					const normalizedPropName = "normalized" + setting.marketProperty[0].toUpperCase() + setting.marketProperty.slice(1);
					markets = markets.filter(function(market) {
						if (market.hasOwnProperty(normalizedPropName)) {
							return market[normalizedPropName].some(item => item.includes(term.string)) === !term.negated;
						} else {
							return market[setting.marketProperty].some(item => normalizeString(item).includes(term.string)) === !term.negated;
						}
					});
				}
			}
		}
	}

	for (let term of searchTerms.any) {
		if (term.type === "exact") {
			markets = markets.filter(function(market) {
				if (market.question.includes(term.string) === !term.negated) {
					return true;
				}
				if (market.description.includes(term.string) === !term.negated) {
					return true;
				}
				if (market.answers.some(answer => answer.includes(term.string)) === !term.negated) {
					return true;
				}
				return false;
			});
		} else if (term.type === "normalized") {
			markets = markets.filter(function(market) {
				if (market.normalizedQuestion.includes(term.string) === !term.negated) {
					return true;
				}
				if (market.normalizedDescription.includes(term.string) === !term.negated) {
					return true;
				}
				if (market.normalizedAnswers.some(answer => answer.includes(term.string) === !term.negated)) {
					return true;
				}
				return false;
			});
		}
	}

	if (searchTerms.custom) {
		//It's much faster to only have a single eval call.
		let customFuction;
		let errored = false;
		try {
			customFuction = eval(`(function(market) {${searchTerms.custom}})`);
		} catch (e) {
			console.error(`Error parsing script. Message: "${e.message}"`);
			errored = true;
		}
		if (!errored) {
			markets = markets.filter(function(market) {
				try {
					if (errored) {
						return false;
					}
					return customFuction(market);
				} catch (e) {
					console.error(`Error evaluating script. Message: "${e.message}" Market object follows:`);
					console.log(market);
					errorShown = true;
					return false;
				}
			});
		}
	}

	currentMarketArray = markets;
}

let numDots = 0;
const loadingInterval = setInterval(function() {
	if (!(allRemoteMarketsLoaded || allLocalMarketsLoaded)) {
		document.getElementById("loadingIndicator").textContent = `Loading markets${".".repeat(numDots)}`;
		numDots++;
		if (numDots > 3) {
			numDots = 0;
		}
	}
}, 500)

const searchFruits = ["Caring kumquat", "Sassy strawberry", "Mysterious mango", "Embarrassed eggplant"];
const preloadedImages = [];
for (let fruit of searchFruits) {
	const image = new Image();
	image.src = `${fruit.toLowerCase().replace(" ", "-")}.png`;
	document.body.appendChild(image);
	image.style.display = "none";
	preloadedImages.push(image)
}

let lastRenderHadNoMarkets = false;
const displayRows = function() {
	const startTime = performance.now();

	if (lastRenderHadNoMarkets && currentMarketArray.length === 0) {
		//console.log("Rendering took " + (performance.now() - startTime) + "ms");
		return;
	}
	lastRenderHadNoMarkets = currentMarketArray.length === 0;

	const searchResults = document.getElementById("searchResults");
	searchResults.innerHTML = "";

	if (currentMarketArray.length === 0 && !dashboardOn) {
		searchResultsTitleBar.style.display = "none";
		const fruit = searchFruits[Math.floor(Math.random() * searchFruits.length)];
		document.getElementById("numResults").textContent = `0 results. ${fruit} is here for you.`;
		searchResults.innerHTML = `<img id="searchFruit" src="${fruit.toLowerCase().replace(" ", "-")}.png">`;
		//console.log("Rendering took " + (performance.now() - startTime) + "ms");
		return;
	} else {
		searchResultsTitleBar.style.display = "";
	}

	document.getElementById("numResults").textContent = "";
	if (currentMarketArray.length <= marketLimit) {
		document.getElementById("numResults").textContent += `${currentMarketArray.length} results:`;
	} else {
		document.getElementById("numResults").textContent += `${currentMarketArray.length} results (displaying ${marketLimit}):`;
	}

	for (let i in currentMarketArray) {
		if (i < marketLimit) {
			if (!currentMarketArray[i].elementRef) {
				createRow(currentMarketArray[i]);
			}
			searchResults.appendChild(currentMarketArray[i].elementRef);
		} else {
			break;
		}
	}

	//console.log("Rendering took " + (performance.now() - startTime) + "ms");
}

//Add rows for markets in the background to make future renders faster.
setInterval(function() {
	const startTime = performance.now();
	for (let i in allMarketArray) {
		if (!allMarketArray[i].elementRef) {
			createRow(allMarketArray[i]);
		}
		if (performance.now() - startTime > 20) {
			break;
		}
	}
}, 100);

let lastFreeTime = performance.now();
setInterval(function() {
	lastFreeTime = performance.now();
}, 20);

const createRow = function(market) {
	const row = document.createElement("span");
	row.classList.add("row");
	row.setAttribute("id", market.id);

	const question = document.createElement("a");
	question.classList.add("questionVisibility");
	question.addEventListener("click", function() {
		tellServerToUpdateMarket(market.id);
	});
	question.addEventListener("auxclick", function() {
		tellServerToUpdateMarket(market.id);
	});
	question.addEventListener("contextmenu", function() {
		tellServerToUpdateMarket(market.id);
	});
	row.appendChild(question);

	const description = document.createElement("p");
	description.classList.add("descriptionVisibility");
	row.appendChild(description);

	const groupsList = document.createElement("p");
	groupsList.classList.add("groupsVisibility");
	row.appendChild(groupsList);

	const creator = document.createElement("p");
	creator.classList.add("clickable", "fancyOval", "creatorVisibility");
	creator.addEventListener("click", function() {
		document.getElementById("creator").value = market.creatorUsername;
		uiControlFlow("filtersChanged");
	});
	row.appendChild(creator);

	const closeTime = document.createElement("p");
	closeTime.classList.add("closeTimeVisibility");
	row.appendChild(closeTime);

	const liquidity = document.createElement("p");
	liquidity.classList.add("rightAlign", "liquidityVisibility");
	row.appendChild(liquidity);

	const volume = document.createElement("p");
	volume.classList.add("rightAlign", "volumeVisibility");
	row.appendChild(volume);

	const volume24Hours = document.createElement("p");
	volume24Hours.classList.add("rightAlign", "volume24HoursVisibility");
	row.appendChild(volume24Hours);

	const totalTraders = document.createElement("p");
	totalTraders.classList.add("rightAlign", "totalTradersVisibility");
	row.appendChild(totalTraders);

	const lastUpdate = document.createElement("p");
	lastUpdate.classList.add("lastUpdatedTimeVisibility");
	row.appendChild(lastUpdate);

	const percentage = document.createElement("p");
	percentage.classList.add("rightAlign", "percentageVisibility");
	row.appendChild(percentage);

	const dashboardButton = document.createElement("button");
	dashboardButton.classList.add("searchButton", "dashboardVisibility");
	dashboardButton.textContent = dashboard.includes(market.id) ? "Remove" : "Add";
	dashboardButton.addEventListener("click", function() {
		if (dashboardOn) {
			dashboard.splice(dashboard.indexOf(market.id), 1);
			dashboardButton.parentElement.parentElement.removeChild(dashboardButton.parentElement);
		} else {
			if (dashboardButton.textContent === "Add") {
				dashboard.push(market.id);
				localStorage.setItem("marketDashboard", JSON.stringify(dashboard));
				tellServerToUpdateMarket(market.id);
				dashboardButton.textContent = "Remove";
			} else {
				dashboard.splice(dashboard.indexOf(market.id), 1);
				dashboardButton.textContent = "Add";
			}
		}
	});
	row.appendChild(dashboardButton);

	const betting = document.createElement("div");
	betting.classList.add("bettingVisibility");
	const bettingMax = document.createElement("input");
	bettingMax.classList.add("bettingMax");
	bettingMax.setAttribute("type", "number");
	bettingMax.setAttribute("min", "1");
	bettingMax.setAttribute("max", "999999");
	bettingMax.setAttribute("integral", "true");
	const bettingPercentage = document.createElement("input");
	bettingPercentage.setAttribute("type", "number");
	bettingPercentage.setAttribute("min", "0");
	bettingPercentage.setAttribute("max", "100");
	const bet = document.createElement("button");
	bet.classList.add("searchButton");
	bet.textContent = "Bet";
	bet.addEventListener("click", async function() {
		//We don't pass in the market because it could change after the handler was created.
		placeBet(market.id, bettingPercentage, bettingMax);
	});
	bettingPercentage.addEventListener("keypress", async function(e) {
		if (e.key === "Enter") {
			placeBet(market.id, bettingPercentage, bettingMax);
		}
	});
	bettingMax.addEventListener("keypress", async function(e) {
		if (e.key === "Enter") {
			placeBet(market.id, bettingPercentage, bettingMax);
		}
	});
	const maxLabel = document.createElement("label");
	maxLabel.textContent = " Mana: ";
	const probLabel = document.createElement("label");
	probLabel.textContent = "%: ";
	probLabel.appendChild(bettingPercentage);
	maxLabel.appendChild(bettingMax);
	betting.appendChild(probLabel);
	betting.appendChild(maxLabel);
	betting.appendChild(bet);
	row.appendChild(betting);

	updateRow(row, market);

	allMarketData[market.id].elementRef = row;
}

const updateRelativeTimeDisplays = function(ms) {
	for (let market of currentMarketArray) {
		if (!market.elementRef) {
			continue;
		}
		if (market.hasOwnProperty("closeTime") && market.closeTime - Date.now() <= ms) {
			let string = formatDateDistance(market.closeTime);
			market.elementRef.querySelector(".closeTimeVisibility").textContent = string[0].toUpperCase() + string.slice(1);
		}
		if (market.hasOwnProperty("lastUpdatedTime") && Date.now() - market.lastUpdatedTime <= ms) {
			let string = formatDateDistance(market.lastUpdatedTime);
			market.elementRef.querySelector(".lastUpdatedTimeVisibility").textContent = string[0].toUpperCase() + string.slice(1);
		}
	}
}
setInterval(function() {updateRelativeTimeDisplays(60000)}, 1000);
setInterval(function() {updateRelativeTimeDisplays(3600000)}, 60000);

const updateRow = function(row, market) {
	const question = row.querySelector(".questionVisibility");
	question.textContent = market.question;
	question.setAttribute("href", marketUrl(market));

	const description = row.querySelector(".descriptionVisibility");
	description.textContent = market.description;

	const groupsList = row.querySelector(".groupsVisibility");
	groupsList.innerHTML = "";
	for (let groupSlug of market.groups) {
		const group = document.createElement("span");
		group.textContent = groupSlug;
		group.classList.add("clickable", "fancyOval");
		group.addEventListener("click", function() {
			document.getElementById("groups").value = groupSlug;
			uiControlFlow("filtersChanged");
		});
		createTooltip(group, "group");
		groupsList.appendChild(group);
	}

	const creator = row.querySelector(".creatorVisibility");
	creator.textContent = market.creatorUsername;
	createTooltip(creator, "creator");

	const closeTime = row.querySelector(".closeTimeVisibility");
	if (market.hasOwnProperty("closeTime")) {
		let string = formatDateDistance(market.closeTime);
		closeTime.textContent = string[0].toUpperCase() + string.slice(1);
	} else {
		closeTime.textContent = "";
	}

	const liquidity = row.querySelector(".liquidityVisibility");
	if (market.hasOwnProperty("liquidity")) {
		liquidity.textContent = `M$${Math.round(market.liquidity).toLocaleString()}`;
	} else {
		liquidity.textContent = "";
	}

	const volume = row.querySelector(".volumeVisibility");
	if (market.hasOwnProperty("volume")) {
		volume.textContent = `M$${Math.round(market.volume).toLocaleString()}`;
	} else {
		volume.textContent = "";
	}

	const volume24Hours = row.querySelector(".volume24HoursVisibility");
	if (market.hasOwnProperty("volume24Hours")) {
		volume24Hours.textContent = `M$${Math.round(market.volume24Hours).toLocaleString()}`;
	} else {
		volume24Hours.textContent = "";
	}

	const totalTraders = row.querySelector(".totalTradersVisibility");
	if (market.hasOwnProperty("totalTraders")) {
		totalTraders.textContent = `${Math.round(market.totalTraders).toLocaleString()}`;
	} else {
		totalTraders.textContent = "";
	}

	const lastUpdate = row.querySelector(".lastUpdatedTimeVisibility");
	if (market.hasOwnProperty("lastUpdatedTime")) {
		let string = formatDateDistance(market.lastUpdatedTime);
		lastUpdate.textContent = string[0].toUpperCase() + string.slice(1);
	} else {
		lastUpdate.textContent = "";
	}

	const percentage = row.querySelector(".percentageVisibility");
	if (market.hasOwnProperty("probability")) {
		percentage.textContent = (Math.round(market.probability * 100 * 10) / 10).toFixed(1) + "%";
	} else {
		percentage.textContent = "";
	}

	//No changes ever need to be made to the dashboard button.

	const betting = row.querySelector(".bettingVisibility");
	const bettingMax = betting.querySelector(".bettingMax");
	bettingMax.value = Math.round(market.liquidity / 10);
	if (market.hasOwnProperty("probability")) {
		betting.style.display = "";
	} else {
		betting.style.display = "none";
	}
}

const createTooltip = function(element, type) {
	const tooltip = document.createElement("p");
	tooltip.classList.add("tooltip");
	element.appendChild(tooltip);
	const value = element.textContent;
	element.addEventListener("mouseover", function(event) {
		tooltip.style.display = "block";
		if (type === "group") {
			tooltip.textContent = numMarketsInGroup(value) + " markets";
		} else {
			tooltip.textContent = numMarketsWithCreator(value) + " markets";
		}
		tooltip.style.left = event.pageX + "px";
		tooltip.style.top = event.pageY - 40 + "px";
	});
	element.addEventListener("mouseleave", function() {
		tooltip.style.display = "none";
	});
}

const placeBet = async function(marketId, percentageInput, maxInput) {
	if (percentageInput.value === "") {
		alert("Please enter a percentage.");
		return;
	}
	if (maxInput.value === "") {
		alert("Please enter a manimum amount of mana to bet.");
		return;
	}
	//We don't pass in the market because it could change after the handler was created.
	const market = allMarketData[marketId];
	const probToBetTo = Number(percentageInput.value) / 100;
	const response = await fetch('/manifoldBettingMirror', {
		method: 'POST',
		body: JSON.stringify({
					'amount': Number(maxInput.value),
					'limitProb': probToBetTo,
					'outcome': market.probability > probToBetTo ? "NO" : "YES",
					'contractId': market.id,
					'expiresAt': Date.now() + 2000,
					'key': document.getElementById("apiKey").value,
			}),
		headers: {
					'Content-Type': 'application/json',
			}
	});
	const actualResponse = await response.json();
	console.log(actualResponse)
	if (actualResponse.message === "Invalid Authorization header.") {
		alert("Invalid API key");
	}
	if (actualResponse.error) {
		alert(actualResponse.error);
	}
	if (actualResponse.message) {
		alert(actualResponse.message);
	}
	if (actualResponse.betId) {
		maxInput.value = "";
		percentageInput.value = "";
	}
}

//Thank you ChatGPT.
function extractQuotedSubstrings(inputString) {
  const regex = /-?"([^"]*)"/g;
  const quotedSubstrings = [];
  let remainingString = inputString;
  let match;
  while ((match = regex.exec(inputString)) !== null) {
		quotedSubstrings.push({
			"negated": match[0].startsWith("-"),
			"string": match[1],
		}); // Add the quoted substring to the list
    remainingString = remainingString.replace(match[0], ''); // Remove the quoted substring from the remaining string
  }
  return {
    quotedSubstrings,
    remainingString: remainingString
  };
}
function parseQueryString(url) {
  const queryString = url.split('?')[1];
  if (!queryString) {
    return {};
  }
  const keyValuePairs = queryString.split('&');
  const params = {};
  keyValuePairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    params[key] = decodeURIComponent(value);
  });
  return params;
}
function formatDateDistance(inputTimestamp) {
  const inputDate = new Date(inputTimestamp);
  const currentDate = new Date();
  const date = new Date(inputDate);
  const millisecondsInSecond = 1000;
  const millisecondsInMinute = 60 * millisecondsInSecond;
  const millisecondsInHour = 60 * millisecondsInMinute;
  const millisecondsInDay = 24 * millisecondsInHour;
  const millisecondsInWeek = 7 * millisecondsInDay;
  const millisecondsInMonth = 30 * millisecondsInDay;
  const millisecondsInYear = 365 * millisecondsInDay;
  const timeDifference = date - currentDate;
  const absoluteTimeDifference = Math.abs(timeDifference);
  if (absoluteTimeDifference < millisecondsInSecond) {
    return timeDifference > 0 ? 'in 1 second' : '1 second ago';
  } else if (absoluteTimeDifference < millisecondsInMinute) {
    const seconds = Math.floor(absoluteTimeDifference / millisecondsInSecond);
    return `${timeDifference > 0 ? 'in' : ''} ${seconds} second${seconds === 1 ? '' : 's'}${timeDifference > 0 ? '' : ' ago'}`;
  } else if (absoluteTimeDifference < millisecondsInHour) {
    const minutes = Math.floor(absoluteTimeDifference / millisecondsInMinute);
    return `${timeDifference > 0 ? 'in' : ''} ${minutes} minute${minutes === 1 ? '' : 's'}${timeDifference > 0 ? '' : ' ago'}`;
  } else if (absoluteTimeDifference < millisecondsInDay) {
    const hours = Math.floor(absoluteTimeDifference / millisecondsInHour);
    return `${timeDifference > 0 ? 'in' : ''} ${hours} hour${hours === 1 ? '' : 's'}${timeDifference > 0 ? '' : ' ago'}`;
  } else if (absoluteTimeDifference < millisecondsInWeek) {
    const days = Math.floor(absoluteTimeDifference / millisecondsInDay);
    return `${timeDifference > 0 ? 'in' : ''} ${days} day${days === 1 ? '' : 's'}${timeDifference > 0 ? '' : ' ago'}`;
  } else if (absoluteTimeDifference < millisecondsInMonth) {
    const weeks = Math.floor(absoluteTimeDifference / millisecondsInWeek);
    return `${timeDifference > 0 ? 'in' : ''} ${weeks} week${weeks === 1 ? '' : 's'}${timeDifference > 0 ? '' : ' ago'}`;
  } else if (absoluteTimeDifference < millisecondsInYear) {
    const months = Math.floor(absoluteTimeDifference / millisecondsInMonth);
    return `${timeDifference > 0 ? 'in' : ''} ${months} month${months === 1 ? '' : 's'}${timeDifference > 0 ? '' : ' ago'}`;
  } else {
    const years = Math.floor(absoluteTimeDifference / millisecondsInYear);
    return `${timeDifference > 0 ? 'in' : ''} ${years} year${years === 1 ? '' : 's'}${timeDifference > 0 ? '' : ' ago'}`;
  }
}

//Split up an object between localstorage and the file system, for faster loading. Localstorage is gzipped to fit under the 5MB size limit. Saves them as an array, after removing irrelevant fields.
const savingWorker = new Worker("savingWorker.js");
const saveMarketData = async function() {
	const simpleMarkets = allMarketArray.map(market => Object.assign({}, market));
	for (let market of simpleMarkets) {
		//elementRef has to be removed before sending this to the worker because HTML elements can't be cloned.
		delete market.elementRef;
	}
	savingWorker.postMessage(simpleMarkets);
}
savingWorker.onmessage = async function(message) {

	localStorage.setItem("savedMarketData", message.data.localStorage);

	const opfsRoot = await navigator.storage.getDirectory();
	const fileHandle = await opfsRoot.getFileHandle('savedMarketData', {create: true});
	const writable = await fileHandle.createWritable();
	await writable.write(message.data.fileSystem);
	await writable.close();

	console.log(`Saved ${message.data.localStorage.length / 1000} kb to localStorage`);
}

const grabUpdates = async function() {
	let grabbedMarkets;
	try {
		grabbedMarkets = await (await fetch("recentlyChangedMarkets.json")).json();
	} catch (e) {
		console.error(e);
		return;
	}
	const startTime = performance.now();
	const changedMarkets = [];

	for (let id in grabbedMarkets) {
		if (allMarketData[id] === undefined || grabbedMarkets[id].lastUpdatedTime !== allMarketData[id].lastUpdatedTime) {
			addNormalizedFieldsToMarketData(grabbedMarkets[id]);
			changedMarkets.push(grabbedMarkets[id]);
		}
	}

	if (changedMarkets.length > 0) {
		uiControlFlow("marketsChanged", changedMarkets);
	}

	if (changedMarkets.length > 0) {
		console.log(`Updated ${changedMarkets.length} markets in ${performance.now() - startTime}ms`);
	}
}

const sleep = async function(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const loop = async function() {
	while (true) {
		await grabUpdates();
		if (allRemoteMarketsLoaded) {
			await sleep(1000);
		} else {
			await sleep(10000);//If the main file is still being streamed, we don't want to grab redundant data and slow down processing, but if the user is on a slow connection, we do need to grab updates before they expire on the server.
		}
	}
}
loop();

let queryParams = parseQueryString(window.location.href);
if (queryParams.justshoveitallintooneparameter) {
	queryParams = parseQueryString("https://outsidetheasylum.blog/manifold-search/?" + queryParams.justshoveitallintooneparameter);
}
let defaultLiquidityTo1 = true;
for (let entryField of Object.values(allSettingsData)) {
	if (entryField.type === "sortingWeight" && queryParams.hasOwnProperty(entryField.settingId)) {
		defaultLiquidityTo1 = false;
		queryParams[entryField.settingId] = Number(queryParams[entryField.settingId]);
	}
}
if (defaultLiquidityTo1) {
	queryParams.liquidityWeight = 1;
}
for (let param of ["question", "description", "groups", "answers", "any", "custom", "type"]) {
	if (queryParams[param]) {
		document.getElementById(param).value = queryParams[param].replace(/\+/g, " ");
	}
}
if (queryParams.creator) {
	document.getElementById("creator").value = queryParams.creator.replace(/\+/g, " ");
}
if (queryParams.open) {
	document.getElementById("open").checked = ["t", "true"].includes(queryParams.open);
}
if (queryParams.closed) {
	document.getElementById("closed").checked = ["t", "true"].includes(queryParams.closed);
}
if (queryParams.resolved) {
	document.getElementById("resolved").checked = ["t", "true"].includes(queryParams.resolved);
}
updateSortingOptionDisplay(queryParams);//The extra fields are ignored.
updateSortingOptionValues();
let lucky = false;
if (queryParams.lucky && ["t", "true"].includes(queryParams.lucky)) {
	lucky = true;
}

//Returns an array of normalized markets.
const fileSystemLoadingWorker = new Worker("fileSystemLoadingWorker.js");
fileSystemLoadingWorker.postMessage("begin");
const fileSystemLoadingStartTime = performance.now();
fileSystemLoadingWorker.onmessage = function(message) {
	if (message.data === "no saved markets") {
		console.log(`No saved markets found in ${performance.now() - fileSystemLoadingStartTime}ms`);
	} else {
		console.log(`Loaded ${Object.keys(message.data).length} saved markets from the file system in ${performance.now() - fileSystemLoadingStartTime}ms.`);
		allLocalMarketsLoaded = true;
		clearInterval(loadingInterval);
		document.getElementById("loadingIndicator").style.display = "none";

		uiControlFlow("marketsChanged", message.data);
		createDatalists();
	}
}

document.getElementById("searchCriteria").addEventListener("input", function(event) {
	uiControlFlow("filtersChanged");
});
document.getElementById("question").focus();

for (let entryField of Object.values(allSettingsData)) {
	if (entryField.type === "visibilityOption") {
		const title = document.createElement("span");
		title.textContent = entryField.humanReadableName;
		title.classList.add("columnHeader", entryField.settingId);
		if (entryField.associatedSortingWeight) {
			title.classList.add("clickable");
		}

		title.addEventListener("click", function() {

			let wasAlreadySortedByThis = true;
			for (let weight of Object.values(allSettingsData)) {
				if (weight.type === "visibilityOption" && weight.associatedSortingWeight) {
					if (weight.settingId === entryField.settingId && allSettingsData[weight.associatedSortingWeight].currentValue < 0) {
						wasAlreadySortedByThis = false;
					}
					if (weight.settingId !== entryField.settingId && allSettingsData[weight.associatedSortingWeight].currentValue !== 0) {
						wasAlreadySortedByThis = false;
					}
				}
			}
			if (entryField.settingId === "questionVisibility") {
				updateSortingOptionDisplay({});
				updateSortingOptionValues();
				uiControlFlow("sortingChanged");
			} else if (entryField.associatedSortingWeight) {
				const obj = {};
				if (wasAlreadySortedByThis) {
					obj[entryField.associatedSortingWeight] = -1;
				} else {
					obj[entryField.associatedSortingWeight] = 1;
				}
				updateSortingOptionDisplay(obj);
				updateSortingOptionValues();
				uiControlFlow("sortingChanged");
			}
		});

		searchResultsTitleBar.appendChild(title);
	}
}


fetch("allMarketData.json")
  .then((response) => response.body)
  .then((rb) => {
    const reader = rb.getReader();

    return new ReadableStream({
      start(controller) {
        // The following function handles each data chunk
        function push() {
          // "done" is a Boolean and value a "Uint8Array"
          reader.read().then(({ done, value }) => {
            // If there is no more data to read
            if (done) {
              controller.close();
              return;
            }
            // Get the data and send it to the browser via the controller
            controller.enqueue(value);

            // Do something with the chunks
						internetLoadingWorker.postMessage(value);

            push();
          });
        }

        push();
      },
    });
  })
  .then((stream) =>
    // Respond with our stream
    new Response(stream, { headers: { "Content-Type": "text/html" } }).text(),
  )
  .then((result) => {
    // Do things with result
		internetLoadingWorker.postMessage("all done");
  });

//The worker takes in each chunk of loaded data and returns parsed markets in an array, with normalized fields.
let allRemoteMarketsLoaded = false;
internetLoadingWorker.onmessage = async function(message) {
	createDatalists();
	if (message.data === "all done") {
		console.log("All remote markets loaded");
		allRemoteMarketsLoaded = true;
		saveMarketData();
		document.getElementById("loadingIndicator").style.display = "none";
		clearInterval(loadingInterval);
		return;
	}

	if (message.data.length > 0) {
		uiControlFlow("marketsChanged", message.data);
	}

	//console.log(`Loaded ${message.data.length} markets.`);
}

const locallyStoredMarketDataString = localStorage.getItem("savedMarketData");
if (locallyStoredMarketDataString) {
	let loadedMarkets;
	try {
		loadedMarkets = JSON.parse(gzipToText(locallyStoredMarketDataString));
		//Used to be saved as an object, this can be removed later.
		if (!Array.isArray(loadedMarkets)) {
			loadedMarkets = Object.values(loadedMarkets);
		}
	} catch (e) {
		console.error(e);
		loadedMarkets = [];
	}
	for (let market of loadedMarkets) {
		addNormalizedFieldsToMarketData(market);
	}
	if (loadedMarkets.length > 0) {
		uiControlFlow("marketsChanged", loadedMarkets);
	}
	console.log(`Loaded ${Object.keys(loadedMarkets).length} markets from localStorage`);
}

document.getElementById("mixingWeights").addEventListener("input", function() {
	updateSortingOptionValues();
	uiControlFlow("sortingChanged");
});

document.getElementById("sortOrder").addEventListener("change", function() {
	if (document.getElementById("sortOrder").value === "Mixed") {
		updateSortingOptionDisplay({});
		uiControlFlow("sortingChanged");
	} else {
		const internalSortValue = Object.values(allSettingsData).filter(entryField => entryField.type === "sortingWeight" && entryField.humanReadableName === document.getElementById("sortOrder").value)[0].settingId;
		const obj = {};
		obj[internalSortValue] = 1
		updateSortingOptionDisplay(obj);
		updateSortingOptionValues();
		uiControlFlow("sortingChanged");
	}
});

document.getElementById("clear").addEventListener("click", function() {

	for (let id in allSettingsData) {
		const setting = allSettingsData[id];
		if (setting.type === "searchOption") {
			console.log(setting)
			//Is this setting the value of some checkboxes and the checked status of some text inputs? Yes. Do I care? No.
			document.getElementById(setting.settingId).value = setting.defaultValue;
			document.getElementById(setting.settingId).checked = setting.defaultValue;
		}
	}
	uiControlFlow("filtersChanged");
});

const tellServerToUpdateMarket = async function(marketId) {//findthis this isn't being used right now, left around in case we reuse for groups updating.
	return;
	const response = await fetch('/updateMarket', {
		method: 'POST',
		body: JSON.stringify({"marketId": marketId}),
		headers: {
					'Content-Type': 'application/json',
			}
	});
	return response;
}

const casheDashboard = async function() {
	for (let market of dashboard) {
		await tellServerToUpdateMarket(market.id);
	}
}
setInterval(casheDashboard, 240000);
casheDashboard();

const convertHumanDateToTimestamp = function(string, assumeFuture) {
	string = string.trim().toLowerCase();
	if (/^\d+[\/-]\d+([-\/]\d+)?$/.test(string)) {
		const tellMonthFromDay = function(str1, str2) {//Defaults to 1st one is month if it can't tell.
			let month, day;
			if (Number(str1) > 12) {
				day = Number(str1);
				month = Number(str2);
			} else {
				day = Number(str2);
				month = Number(str1);
			}
			return [month, day];
		}

		let year, month, day;
		const numStrings = string.split(/[/-]/);

		if (numStrings.length === 2) {
			year = new Date().getFullYear();
			month = tellMonthFromDay(numStrings[0], numStrings[1])[0];
			day = tellMonthFromDay(numStrings[0], numStrings[1])[1];
		}

		if (numStrings.length === 3) {
			//If the year is clearly last, we try to figure out whether it's DMY or MDY.
			if (numStrings[2].length === 4 || Number(numStrings[2]) > 31) {
				year = Number(numStrings[2]);
				month = tellMonthFromDay(numStrings[0], numStrings[1])[0];
				day = tellMonthFromDay(numStrings[0], numStrings[1])[1];
			} else {
				year = Number(numStrings[0]);
				month = Number(numStrings[1]);
				day = Number(numStrings[2]);
			}
		}
		return new Date(year, month - 1, day).getTime();
	}

	if (/(\d+(\.\d+)?[lceymfwdhis])+/.test(string)) {
		//This doesn't account for leap years, leap seconds, or differing month lengths. In order to not have unexpected results, we treat all months as 31 days and all years as leap years.
		const mapping = {
			"l": 31557600000000,//Millenium
			"c": 3155760000000,//Century
			"e": 315576000000,//Decade
			"y": 31622400000,//Year
			"m": 2678400000,//Month
			"f": 1209600000,//Fortnight
			"w": 604800000,//Week
			"d": 86400000,//Day
			"h": 3600000,//Hour
			"i": 60000,//Minute
			"s": 1000,//Second
		}
		const sections = Array.from(string.matchAll(/\d+(\.\d+)?[lceymfwdhis]/g));
		let previousChar;
		let totalDistance = 0;
		for (let match of sections) {
			const section = match[0];
			let lastChar = section.slice(-1);
			const num = Number(section.slice(0, -1));
			//Special case to handle minutes and months both starting with m. We don't add any special cases for decades or centuries because mobody cares.
			if (lastChar === "m" && ["f", "w", "d", "h"].includes(previousChar)) {
				lastChar = "i";
			}
			totalDistance += mapping[lastChar] * num;
			previousChar = lastChar;
		}
		if (assumeFuture) {
			return Date.now() + totalDistance;
		} else {
			return Date.now() - totalDistance;
		}
	}

	//If the input string is invalid, use the current time, cause why not. (In particular users are told they can enter "0" or "now" for the current time.)
	return Date.now();
}

const exportResults = function() {
	document.getElementById('exportDiv').style.display = "block";
	if (document.getElementById("exportUrl").checked) {
		document.getElementById("exportData").value = currentMarketArray.map(market => marketUrl(market)).join("\n");
	} else if (document.getElementById("exportQuestion").checked) {
		document.getElementById("exportData").value = currentMarketArray.map(market => market.question).join("\n");
	} else {
		document.getElementById("exportData").value = currentMarketArray.map(market => market.id).join("\n");
	}
}

const numMarketsInGroup = function(group) {
	return allMarketArray.filter(market => market.groups.includes(group)).length;
}
const numMarketsWithCreator = function(creator) {
	return allMarketArray.filter(market => market.creatorUsername === creator).length;
}
