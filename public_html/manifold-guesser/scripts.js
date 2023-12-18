const marketLimit = 200;
const randomSeed = Math.floor(Math.random() * 20);
let verbose = false;
let randomMarket;

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


let visualProbability = false;
document.getElementById("visibilityOptions").addEventListener("input", function() {
	updateVisibilityOptions();
	uiControlFlow("visibilityChanged");
});


//Polyfill for Chrome not supporting for await...of iteration of a ReadableStream, from https://bugs.chromium.org/p/chromium/issues/detail?id=929585
ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const reader = this.getReader()
  try {
    while (true) {
      const {done, value} = await reader.read()
      if (done) return
      yield value
    }
  }
  finally {
    reader.releaseLock()
  }
}

//The settingId, object key, and element ID in the HTML are all the same.
const allSettingsData = {
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
		"currentValue": true,
		"defaultValue": true,
	},
	"groupsVisibility": {
		"type": "visibilityOption",
		"settingId": "groupsVisibility",
		"humanReadableName": "Groups",
		"currentValue": false,
		"defaultValue": false,
	},
	"creatorVisibility": {
		"type": "visibilityOption",
		"settingId": "creatorVisibility",
		"humanReadableName": "Creator",
		"currentValue": false,
		"defaultValue": false,
	},
	"closeTimeVisibility": {
		"type": "visibilityOption",
		"settingId": "closeTimeVisibility",
		"humanReadableName": "Closes",
		"currentValue": true,
		"defaultValue": true,
	},
	"createdTimeVisibility": {
		"type": "visibilityOption",
		"settingId": "createdTimeVisibility",
		"humanReadableName": "Created",
		"currentValue": true,
		"defaultValue": true,
	},
	"liquidityVisibility": {
		"type": "visibilityOption",
		"settingId": "liquidityVisibility",
		"humanReadableName": "Liquidity",
		"currentValue": false,
		"defaultValue": false,
	},
	"volumeVisibility": {
		"type": "visibilityOption",
		"settingId": "volumeVisibility",
		"humanReadableName": "Volume",
		"currentValue": false,
		"defaultValue": false,
	},
	"totalTradersVisibility": {
		"type": "visibilityOption",
		"settingId": "totalTradersVisibility",
		"humanReadableName": "Total traders",
		"currentValue": true,
		"defaultValue": true,
	},
	"lastUpdatedTimeVisibility": {
		"type": "visibilityOption",
		"settingId": "lastUpdatedTimeVisibility",
		"humanReadableName": "Last updated",
		"currentValue": true,
		"defaultValue": true,
	},
	"bettingVisibility": {
		"type": "visibilityOption",
		"settingId": "bettingVisibility",
		"humanReadableName": "Betting",
		"currentValue": false,
		"defaultValue": false,
	},
	"marketURLVisibility": {
		"type": "visibilityOption",
		"settingId": "marketURLVisibility",
		"humanReadableName": "Market URL",
		"currentValue": false,
		"defaultValue": false,
	},
	"timeSpentVisibility": {
		"type": "visibilityOption",
		"settingId": "timeSpentVisibility",
		"humanReadableName": "Time spent",
		"currentValue": true,
		"defaultValue": true,
	},

	"descriptionLength": {
		"type": "searchOption",
		"settingId": "descriptionLength",
		"inputFormat": "numericalRange",
		"currentValue": "100-1000",
		"defaultValue": "100-1000",
		"marketProperty": "description.length",
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
		"currentValue": "BINARY:cpmm-1",
		"defaultValue": "BINARY:cpmm-1",
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
	"totalTraders": {
		"type": "searchOption",
		"settingId": "totalTraders",
		"inputFormat": "numericalRange",
		"currentValue": "10-",
		"defaultValue": "10-",
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
}

//Stores a reference to each market object sorted by the relevant sorting function assuming a weight of 1 and one assuming a weight of -1.
const presortedArrays = {};

const insertMultipleItemsIntoSortedArray = function(items, array, comparitorFunction) {
	const sortedCopy = items.toSorted(comparitorFunction);
	const tempArray = [];
	while (array.length > 0 || sortedCopy.length > 0) {
		if (sortedCopy.length === 0) {
			tempArray.push(array.pop());
		} else if (array.length === 0) {
			tempArray.push(sortedCopy.pop());
		} else if (comparitorFunction(array[array.length - 1], sortedCopy[sortedCopy.length - 1]) < 0) {
			tempArray.push(sortedCopy.pop());
		} else {
			tempArray.push(array.pop());
		}
	}
	while (tempArray.length > 0) {
		array.push(tempArray.pop());
	}
}

const removeMarketsWithSameIdFromPresortedArrays = function(array, marketsToRemove) {
	for (let market of marketsToRemove) {
		for (let i in array) {
			if (market.id === array[i].id) {
				array.splice(i, 1);
				break;
			}
		}
	}
}


let allMarketData = {},//Also stores a reference to a row element.
		allMarketArray = [],//This is Object.values(allMarketData), kept up to date any time allMarketData changes. Saves ~25ms on every search.
		currentMarketArray = [];//This is allMarketArray filtered down to the markets the user is currently looking at. (Includes markets over the display limit.)

let allMarketsSorted = true;

const pendingMarketsToAdd = [];
const addMarkets = async function() {
	while (true) {
		if (pendingMarketsToAdd.length > 0) {
			const markets = pendingMarketsToAdd.splice(0, 500);
			uiControlFlow("marketsChanged", markets);
		}
		await sleep(30);
	}
}

const convertInputMarketsToMarketsToDoStuffWith = function(markets) {
	markets = markets.filter(function(market) {
		return market.hasOwnProperty("type") && market.hasOwnProperty("lastUpdatedTime") && !market.hasOwnProperty("isResolved") && market.type !== "bugged";
	});
	if (markets.length > 1 && !markets[0].normalizedQuestion) {
		throw new Error("Markets not normalized.");
	}
	const uniqueMarkets = {};
	for (let market of markets) {
		if (!uniqueMarkets[market.id] || uniqueMarkets[market.id].lastUpdatedTime < market.lastUpdatedTime) {
			uniqueMarkets[market.id] = market;
		}
	}
	const newMarketsToAdd = [];
	const existingMarketsToEdit = [];
	for (let id in uniqueMarkets) {
		const market = uniqueMarkets[id];
		if (allMarketData[market.id] === undefined) {
			newMarketsToAdd.push(market);
		} else if (market.lastUpdatedTime > allMarketData[market.id].lastUpdatedTime) {
			existingMarketsToEdit.push(market);
		}
	}
	return {
		"newMarketsToAdd": newMarketsToAdd,
		"existingMarketsToEdit": existingMarketsToEdit,
	};
}



//This function handles all modification of the results table, and all modification of allMarketData, allMarketArray, and currentMarketArray.
const uiControlFlow = function(mode, markets) {
	const startTime = performance.now();
	if (!["marketsChanged", "filtersChanged", "visibilityChanged"].includes(mode)) {
		throw new Error(`${mode} is not a valid control flow mode`);
	}

	if (mode === "marketsChanged") {
		const result = convertInputMarketsToMarketsToDoStuffWith(markets);
		const newMarketsToAdd = result.newMarketsToAdd;
		const existingMarketsToEdit = result.existingMarketsToEdit;

		for (let newMarket of newMarketsToAdd) {
			allMarketData[newMarket.id] = newMarket;
			allMarketArray.push(newMarket);
		}
		for (let changedMarket of existingMarketsToEdit) {
			changedMarket.elementRef = allMarketData[changedMarket.id].elementRef;
			allMarketData[changedMarket.id] = changedMarket;
		}
		if (verbose) {console.log(performance.now() - startTime);}
		if (markets.length > 0) {
			if (verbose) {console.log(performance.now() - startTime);}
			allMarketsSorted = true;
			if (verbose) {console.log(performance.now() - startTime);}
			filterMarkets();
			if (verbose) {console.log(performance.now() - startTime);}
			displayRows();
		}
	} else if (mode === "visibilityChanged") {

		document.getElementById("apiKeyLabel").hidden = !allSettingsData.bettingVisibility.currentValue
		document.getElementById("bettingDiv").hidden = !allSettingsData.bettingVisibility.currentValue

		displayMarket(randomMarket)
	} else if (mode === "filtersChanged") {
		filterMarkets();
	}

	history.replaceState({}, "", currentSettingsToUrl());

	if (verbose) {
		console.log(`In total, control flow took ${performance.now() - startTime}ms`);
	}
	const postControlFlowTime = performance.now();
	setTimeout(function() {
		//I think this is mostly the garbage collector.
		//console.log("Post-control-flow microtasks took " + (performance.now() - postControlFlowTime) + "ms");
	}, 0);
}


const updateVisibilityOptions = function() {
	for (let entryField of Object.values(allSettingsData)) {
		if (entryField.type === "visibilityOption") {
			entryField.currentValue = document.getElementById(entryField.settingId).checked;
		}
	}
}



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


const filterMarkets = function() {
	let markets = Array.from(allMarketArray);

	//We parse the inputs into objects for the search functions.
	const searchTerms = {};
	try {
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
					const ranges = parseRangesFromNumberInput(entryField.currentValue, ["closeTime", "createdTime, lastUpdateTime"].includes(entryField.settingId));
					const elementTerms = searchTerms[entryField.settingId] = [];
					for (let i in ranges) {
						ranges[i].min = parseTypeOfNumericalInput(ranges[i].min, "min", entryField.settingId);
						ranges[i].max = parseTypeOfNumericalInput(ranges[i].max, "max", entryField.settingId);
						if (ranges[i].max < ranges[i].min) {
	//						throw new Error(`Invalid numerical entry for ${entryField.settingId}; max less than min`);
								console.log("Invalid numerical entry for ${entryField.settingId}; max less than min")
								return;
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
			markets = markets.filter(market => !market.hasOwnProperty("closeTime") || market.closeTime > Date.now() || market.resolution !== null);
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
							if (market.groups.length >= numGroupsSearchTerm.min && market.groups.length <= numGroupsSearchTerm.max) {
								return true;
							}
						}
						return false;
					});
				} else if (settingId === "descriptionLength") {
					markets = markets.filter(function(market) {
						for (let descriptionLengthSearchTerm of searchTerms.descriptionLength) {
							if(market.description.length >= descriptionLengthSearchTerm.min && market.description.length <= descriptionLengthSearchTerm.max) {
								return true;
							}
						}
						return false;
					});
				} else {
					let settingName = settingId;
					if (settingId === "percentage") {
						settingName = "probability";
					}

					markets = markets.filter(function(market) {
						if (!market.hasOwnProperty(settingName)) {
							return false;//Some markets don't have a close time or percentage, and those shouldn't show up in searches for those qualities.
						}
						for (let range of searchTerms[settingId]) {
							if (market[settingName] >= range.min && market[settingName] <= range.max) {
								return true;
							}
						}
						return false;
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
	} catch (e) {
		console.log(e);
		return;
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
			customFuction = eval(`(function(market) {return ${searchTerms.custom}})`);
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
					errored = true;
					return false;
				}
			});
		}
	}

	currentMarketArray = markets;
}

let numDots = 0;
const loadingInterval = setInterval(function() {
	document.getElementById("loadingIndicator").textContent = `Loading markets${".".repeat(numDots)}`;
	numDots++;
	if (numDots > 3) {
		numDots = 0;
	}
	if ((allRemoteMarketsLoaded || allLocalMarketsLoaded) && pendingMarketsToAdd.length === 0) {
		document.getElementById("loadingIndicator").style.display = "none";
		clearInterval(loadingInterval);
	}
}, 200)

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

	document.getElementById("numResults").textContent = `${currentMarketArray.length} markets pass filters`;
	//console.log("Rendering took " + (performance.now() - startTime) + "ms");
}

let lastFreeTime = performance.now();
setInterval(function() {
	lastFreeTime = performance.now();
}, 5);


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
	//We don't pass in the market because it could change after the handler was created.
	const market = allMarketData[marketId];
	const probToBetTo = Number(percentageInput) / 100;
	const body = JSON.stringify({
				'amount': Number(maxInput),
				'limitProb': probToBetTo,
				'outcome': market.probability > probToBetTo ? "NO" : "YES",
				'contractId': market.id,
				'expiresAt': Date.now() + 2000,
		})

	const response = await fetch("https://api.manifold.markets/v0/bet/", {
  method: "POST",
  headers: {'Content-Type': 'application/json', 'Authorization': 'Key ' + document.getElementById("apiKey").value},
	body: body
	})


	const actualResponse = await response.json();
	if (actualResponse.message === "Invalid Authorization header.") {
		alert("Invalid API key");
	} else if (actualResponse.error) {
		alert(actualResponse.error);
	} else if (actualResponse.message) {
		alert(actualResponse.message);
	} else {
		document.getElementById("betinfo").textContent = "Bet sent successfully!"
		document.getElementById("bet").disabled = true

		const response = await fetch("/?" + JSON.stringify({"type":"bet","id":randomId,"userId":userId,"bet":actualResponse}));
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
	const start = performance.now();
	const simpleMarkets = allMarketArray.map(market => Object.assign({}, market));
	for (let market of simpleMarkets) {
		//elementRef has to be removed before sending this to the worker because HTML elements can't be cloned.
		delete market.elementRef;
	}
	savingWorker.postMessage(simpleMarkets);
	//console.log(performance.now() - start)
}
savingWorker.onmessage = async function(message) {

	localStorage.setItem("savedMarketData", message.data.localStorage);

	const opfsRoot = await navigator.storage.getDirectory();
	const fileHandle = await opfsRoot.getFileHandle('savedMarketData', {create: true});
	const writable = await fileHandle.createWritable();
	await writable.write(message.data.fileSystem);
	await writable.close();

	//console.log(`Saved ${(message.data.localStorage.length / 1000000).toFixed(1)}MB to localStorage, ${(message.data.fileSystem.length / 1000000).toFixed(1)}MB to the file system`);

	setTimeout(saveMarketData, 60000)
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

	for (let id in grabbedMarkets) {
		if (allMarketData[id] === undefined || grabbedMarkets[id].lastUpdatedTime > (allMarketData[id].lastUpdatedTime || 0)) {
			addNormalizedFieldsToMarketData(grabbedMarkets[id]);
			pendingMarketsToAdd.push(grabbedMarkets[id]);
		}
	}
}

const sleep = async function(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const newMarketLoop = async function() {
	while (true) {
		await grabUpdates();
		if (allRemoteMarketsLoaded) {
			await sleep(500);
		} else {
			await sleep(5000);//If the main file is still being streamed, we don't want to grab redundant data and slow down processing, but if the user is on a slow connection, we do need to grab updates before they expire on the server.
		}
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

		title.addEventListener("click", function() {

			let wasAlreadySortedByThis = true;
		});

	}
}

//Takes in each chunk of loaded data as a uint8array and returns parsed markets in an array, with normalized fields.
const networkLoadingWorker = new Worker("jsonStreamLoadingWorker.js");
const fileSystemLoadingWorker = new Worker("jsonStreamLoadingWorker.js");

const fetchNetworkMarketsInChunks = async function() {
	const response = await fetch("allMarketData.json");
	for await (const chunk of response.body) {
		networkLoadingWorker.postMessage(chunk);
	}
	networkLoadingWorker.postMessage("all done");
}
const fetchFileSystemMarketsInChunks = async function() {
	const opfsRoot = await navigator.storage.getDirectory();
	const fileHandle = await opfsRoot.getFileHandle('savedMarketData', {create: true});
	const file = await fileHandle.getFile();
	const stream = await file.stream();
	for await (const chunk of stream) {
		fileSystemLoadingWorker.postMessage(chunk);
	}
	fileSystemLoadingWorker.postMessage("all done");
}

let allRemoteMarketsLoaded = false;
let allLocalMarketsLoaded = false;
const handleReturnedChunkOfMarkets = async function(data, origin) {
	if (data === "all done") {
		console.log(`All ${origin} markets loaded`);
		if (origin === "network") {
			allRemoteMarketsLoaded = true;
			saveMarketData();
		} else {
			allLocalMarketsLoaded = true;
		}
		return;
	}
	pendingMarketsToAdd.push(...data);

	createDatalists();
}

networkLoadingWorker.onmessage = function(message) {
	handleReturnedChunkOfMarkets(message.data, "network");
}
fileSystemLoadingWorker.onmessage = function(message) {
	handleReturnedChunkOfMarkets(message.data, "fileSystem");
}


document.getElementById("reset").addEventListener("click", function() {
	for (let id in allSettingsData) {
		const setting = allSettingsData[id];
		if (setting.type === "searchOption") {
			//Is this setting the value of some checkboxes and the checked status of some text inputs? Yes. Do I care? No.
			document.getElementById(setting.settingId).value = setting.defaultValue;
			document.getElementById(setting.settingId).checked = setting.defaultValue;
		}
	}
	uiControlFlow("visibilityChanged");
});


document.getElementById("clear").addEventListener("click", function() {
	for (let id in allSettingsData) {
		const setting = allSettingsData[id];
		if (setting.type === "searchOption") {
			//Is this setting the value of some checkboxes and the checked status of some text inputs? Yes. Do I care? No.
			if(setting.settingId === "open") {
				document.getElementById(setting.settingId).value = setting.defaultValue;
				document.getElementById(setting.settingId).checked = setting.defaultValue;
			} else {
				document.getElementById(setting.settingId).value = "";
				document.getElementById(setting.settingId).checked = "";
			}
		}
	}
	uiControlFlow("visibilityChanged");
});


const convertHumanDateToTimestamp = function(string) {
	string = string.trim().toLowerCase();
	let isNegative = false;
	if (Number(string) === 0) {
		return Date.now();
	}
	if (/^\d{1,4}([\/-]\d{1,4})?([-\/]\d{1,4})?$/.test(string)) {
		if (string.startsWith("-")) {
			isNegative = true;
			string = string.slice(1);
		}
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

		if (numStrings.length === 1) {
			year = new Date().getFullYear();
			month = new Date().getMonth();
			day = tellMonthFromDay(numStrings[0], numStrings[1])[1];
		}

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
		//This doesn't account for leap years, leap seconds, or differing month lengths. In order to not have unexpected near-term results, we treat all months as 31 days and all years as leap years. This does mean that searches further in the future than ~2150 can be off by a year or more, but we'll all be dead by then anyway.
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
		if (isNegative) {
			return Date.now() - totalDistance;
		} else {
			return Date.now() + totalDistance;
		}
	}

	//If the input string is invalid, use the current time, cause why not. (In particular users are told they can enter "0" or "now" for the current time.)
	return Date.now();
}

//Takes in a single string and outputs a collection of ranges. Each range is just one or two strings, type-dependent parsing is handled elsewhere.
const parseRangesFromNumberInput = function(string, isTemporal) {

	if (!isTemporal) {
		string = string.replaceAll(/[$M]/g, "");
	}

	//Without the filter it'll create an empty range if the input was empty.
	const ranges = string.replaceAll(/[% ]/g, "").split(",").filter(range => range !== "");

	for (let i in ranges) {
		let subranges;
		if (isTemporal) {
			subranges = ranges[i].split(":");
		} else {
			subranges = ranges[i].split(/[-:]/g);
		}

		if (subranges.length === 1) {
			ranges[i] = {
				"min": subranges[0].trim(),
				"max": subranges[0].trim(),
			}
		} else if (subranges.length === 2) {
			ranges[i] = {
				"min": subranges[0].trim(),
				"max": subranges[1].trim(),
			}
		} else {
			throw new Error(`Invalid numerical entry; cannot determined ranges`);
		}
	}

	return ranges;
}

const parseTypeOfNumericalInput = function(string, endOfScale, type) {
	if (string.trim() === "") {
		if (["closeTime", "createdTime", "lastUpdatedTime"].includes(type)) {
			if (endOfScale === "min") {
				return Number.MIN_SAFE_INTEGER;
			} else {
				return Number.MAX_SAFE_INTEGER;
			}
		} else if (type === "percentage") {
			if (endOfScale === "min") {
				return 0;
			} else {
				return 1;
			}
		} else {
			if (endOfScale === "min") {
				return 0;
			} else {
				return Number.MAX_SAFE_INTEGER;
			}
		}
	}
	let returnNum;
	if (["closeTime", "createdTime", "lastUpdatedTime"].includes(type)) {
		returnNum = convertHumanDateToTimestamp(string)
	} else {
		returnNum = Number(string);
	}
	if (type === "percentage") {
		returnNum /= 100;
		if (returnNum > 1) {
			throw new Error(`Invalid numerical entry for ${type}; percentage cannot be more than 100`);
		}
	}
	if (Number.isNaN(returnNum)) {
		throw new Error(`Invalid numerical entry for ${type}; entry cannot be converted to a number`);
	}
	return returnNum;
}


const numMarketsInGroup = function(group) {
	return allMarketArray.filter(market => market.groups.includes(group)).length;
}
const numMarketsWithCreator = function(creator) {
	return allMarketArray.filter(market => market.creatorUsername === creator).length;
}

let queryParams = parseQueryString(window.location.href);
if (queryParams.justshoveitallintooneparameter) {
	queryParams = parseQueryString("https://outsidetheasylum.blog/manifold-search/?" + queryParams.justshoveitallintooneparameter);
}
const paramsToSet = queryParams;
for (let id in allSettingsData) {
	const setting = allSettingsData[id];
	if (!paramsToSet.hasOwnProperty(setting.settingId)) {
		paramsToSet[setting.settingId] = setting.defaultValue;
	}
	if (typeof setting.defaultValue === "boolean") {
		if (typeof paramsToSet[setting.settingId] !== "boolean") {
			paramsToSet[setting.settingId] = ["t", "true"].includes(paramsToSet[setting.settingId]);
		}
		document.getElementById(setting.settingId).checked = paramsToSet[setting.settingId];
	}
	if (typeof setting.defaultValue === "number") {
		paramsToSet[setting.settingId] = Number(paramsToSet[setting.settingId]);
		document.getElementById(setting.settingId).value = paramsToSet[setting.settingId];
	}
	if (typeof setting.defaultValue === "string") {
		paramsToSet[setting.settingId] = paramsToSet[setting.settingId].replace(/\+/g, " ");
		document.getElementById(setting.settingId).value = paramsToSet[setting.settingId];
	}
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
	pendingMarketsToAdd.push(...loadedMarkets);
	console.log(`Loaded ${Object.keys(loadedMarkets).length} markets from localStorage`);
}

function formatDate(inputTime) {
		let date = new Date(inputTime)
		var options = {year: 'numeric', month: 'short', day: 'numeric' };
		return date.toLocaleDateString("en-US", options)
}


function displayMarket(market) {
	document.getElementById("rTitle").textContent = market.question
	document.getElementById("rTitle").href = marketUrl(market)
	if(allSettingsData.descriptionVisibility.currentValue) {
		document.getElementById("rDescriptionDiv").hidden = false
		if(market.description.length == 0) {
			document.getElementById("rDescription").textContent = "[This market has no description.]"
		} else {
			document.getElementById("rDescription").textContent = market.description
		}
	} else {
		document.getElementById("rDescriptionDiv").hidden = true
	}

	if(allSettingsData.closeTimeVisibility.currentValue) {
		document.getElementById("rClose").textContent = "Closes: " + formatDate(market.closeTime)
	} else {
		document.getElementById("rClose").textContent = ""
	}

	if(allSettingsData.createdTimeVisibility.currentValue) {
		document.getElementById("rCreated").textContent = "Created: " + formatDate(market.createdTime)
	} else {
		document.getElementById("rCreated").textContent = ""
	}


	if(allSettingsData.creatorVisibility.currentValue) {
		document.getElementById("rCreator").textContent = "Market creator: " + market.creatorUsername
	} else {
		document.getElementById("rCreator").textContent = ""
	}

	if(allSettingsData.volumeVisibility.currentValue) {
		document.getElementById("rVolume").textContent = "Volume: " + Math.floor(market.volume)
	} else {
		document.getElementById("rVolume").textContent = ""
	}

	if(allSettingsData.liquidityVisibility.currentValue) {
		document.getElementById("rLiquidity").textContent = "Liquidity: " + market.liquidity
	} else {
		document.getElementById("rLiquidity").textContent = ""
	}


	if(allSettingsData.totalTradersVisibility.currentValue) {
		document.getElementById("rTraders").textContent = "Traders: " + market.totalTraders
	} else {
		document.getElementById("rTraders").textContent = ""
	}


	if(allSettingsData.lastUpdatedTimeVisibility.currentValue) {
		document.getElementById("rUpdated").textContent = "Last updated: " + formatDate(market.lastUpdatedTime)
	} else {
		document.getElementById("rUpdated").textContent = ""
	}

/*
	if(allSettingsData.groupsVisibility.currentValue) {
		let s = "";
		n = market.groups.length
		for (let i = 0; i < n; i++) {
			s += market.groups[i]
			if(i != n-1) {
				s += " • "
			}
		}
		document.getElementById("rGroups").textContent = s
	} else {
		document.getElementById("rGroups").textContent = ""
	}
*/

	if(allSettingsData.marketURLVisibility.currentValue) {
		document.getElementById("rURL").textContent = marketUrl(market)
		document.getElementById("rURL").href = marketUrl(market)
	} else {
		document.getElementById("rURL").textContent = ""
	}

	if(allSettingsData.timeSpentVisibility.currentValue) {
		document.getElementById("rTime").style.display = "block"
	} else {
		document.getElementById("rTime").style.display = "none"
	}
}

let timeSpent;
let lastUpdate = 0;
let paused = false;
let predictionTime;
let streak = 0;
let predictionObject = [];

function updateTime() {
	if(!paused) {
		timeSpent = performance.now() - lastUpdate
	}
	document.getElementById("rTime").textContent = formatSeconds(timeSpent/1000)
}

const questionTimer = setInterval(updateTime, 50)

function newMarket() {
	let n = currentMarketArray.length
	if(n == 0) {
		document.getElementById("errorTab").hidden = false;
		document.getElementById("randomMarket").hidden = true;
		setTimeout(newMarket, 5000)
	} else {

		randomMarket = currentMarketArray[Math.floor(Math.random()*n)]
		document.getElementById("errorTab").hidden = true;
		document.getElementById("randomMarket").hidden = false;

		document.getElementById("skip").textContent = "Skip"
		document.getElementById("guess").disabled = false
		document.getElementById("guess").value = ""
		document.getElementById("bet").disabled = false
		document.getElementById("predict").disabled = false
		document.getElementById("betinfo").textContent = ""

		document.getElementById("resultsDiv").hidden = true
		document.getElementById("iframe").hidden = true
		document.getElementById("iframe").src = marketUrl(randomMarket)

		lastUpdate = performance.now()
		paused = false;
		updateTime()
		uiControlFlow("visibilityChanged");
		displayMarket(randomMarket)
	}
}

/*
document.getElementById('searchCriteria').style.display = "none";
document.getElementById('visibilityOptions').style.display = "none";

const filter = function() {
	if(	document.getElementById('searchCriteria').style.display == "none") {
		document.getElementById('searchCriteria').style.display = "block";
	} else {
		document.getElementById('searchCriteria').style.display = "none";
	}
}

const customize = function() {
	if(	document.getElementById('visibilityOptions').style.display == "none") {
		document.getElementById('visibilityOptions').style.display = "block";
	} else {
		document.getElementById('visibilityOptions').style.display = "none";
	}
}
*/

function formatProb(p) {
	p = p*100
	p = Math.floor(p + 0.5)
	return p + "%"
}


document.getElementById("betsize").value = 10

const predict = function() {
	if(document.getElementById("guess").value.length != 0 && document.getElementById("guess").value >= 0 && document.getElementById("guess").value <= 100) {
		paused = true;
		savePrediction(Date.now())
		streak += 1
		document.getElementById("skip").textContent = "Next"
		if(streak >= 2) {
			document.getElementById("streak").textContent = "\# predictions =" + streak
			document.getElementById("total").textContent = "Total predictions: " + predictionObject.length
		}
		document.getElementById("guess").disabled = true
		document.getElementById("predict").disabled = true
		document.getElementById("resultsDiv").hidden = false
		document.getElementById("betprob").value = document.getElementById("guess").value
		document.getElementById("iframe").hidden = false
/*
		document.getElementById("market").textContent = "Market probability: " + formatProb(randomMarket.probability)
		document.getElementById("difference").textContent = "Difference in predictions: " + formatProb(Math.abs(document.getElementById("guess").value/100 - randomMarket.probability))
		let link = "https://manifold.markets/" + randomMarket.creatorUsername + "/" + randomMarket.slug
		document.getElementById("marketURL").textContent = link
		document.getElementById("marketURL").href = link
*/
	}
}

document.getElementById("guess").addEventListener('keypress', function(e) {
	if(e.key === 'Enter') {
		predict()
	}
});

document.getElementById("identifier").addEventListener('keypress', function(e) {
	if(e.key === 'Enter') {
		identify()
	}
});


function padZero(int) {
	if(int < 10) {
		return "0"+int
	} else {
		return int
	}
}

function formatSeconds(sec) {
	if(sec >= 86400) {
		return "a long time"
	}
	let hours = Math.floor(sec/3600)
	let minutes = Math.floor(sec/60 - 60*hours)
	let seconds = Math.floor(sec - 3600*hours - 60*minutes)
	if(hours == 0) {
		return minutes + ":" + padZero(seconds)
	} else {
		return hours + ":" + padZero(minutes) + ":" + padZero(seconds)
	}
}

const bet = function() {
	if(document.getElementById("betsize").value.length != 0 && document.getElementById("betprob").value.length != 0) {
		let betsize = document.getElementById("betsize").value
		let prob = document.getElementById("betprob").value
		placeBet(randomMarket.id, prob, betsize)
	}
}

var userId = "";
var randomId = "";

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const jsonToUrl = function(obj) {
	s = "?"
	for (key in obj) {
		s += key + "=" + obj[key] + ";"
	}
	return s;
}

const savePrediction = async function(predictionTime) {
	let p = document.getElementById("guess").value
	randomId = makeid(12)
	console.log("here")
	let prediction = 		{
		'type': "save",
		'id': randomId,
		'time': predictionTime,
		'thinking': timeSpent,
		'pUser': p/100,
		'pMarket': randomMarket.probability,
		'userId': userId,
		'marketId': randomMarket.id
	};
//	const response = await fetch("/" + jsonToUrl(prediction))
	const response = await fetch("/?" + JSON.stringify(prediction))
}

const plainText = function(prediction) {
	if(prediction.bet === undefined) {
		return prediction.time + " " + prediction.thinking + " " + prediction.pUser + " " + prediction.pMarket + " " + prediction.userId + " no"
	} else {
		return prediction.time + " " + prediction.thinking + " " + prediction.pUser + " " + prediction.pMarket + " " + prediction.userId + " yes " + prediction.bet.betId + " " + prediction.bet.contractId
	}
}

const humanText = function(prediction) {
	let date = new Date(prediction.time)
	let time = date.toLocaleDateString("en-US", {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'})
	let thinking = Math.floor(prediction.thinking/1000)
	let pUser = formatProb(prediction.pUser)
	let pMarket = formatProb(prediction.pMarket)
	let userId = prediction.userId
	let bet
	if(prediction.bet === undefined) {
		bet = "no"
	} else {
		bet = "yes " + prediction.bet.orderAmount + "M " + formatProb(prediction.bet.limitProb)
	}
	return time + " --- " + thinking + "s --- " + pUser + " --- " + pMarket + " --- " + userId + " --- " + bet
}

var exportDataValue = {"plain": "", "human": "", "json": ""};

const updateExport = function() {
	if (document.getElementById("exportPlain").checked) {
		document.getElementById("exportInfo").textContent = "Time of prediction (since epoch), thinking time, user prediction, market probability, market id, whether user bet. If user did bet, betId"
		document.getElementById("exportData").value = exportDataValue.plain;
	} else if (document.getElementById("exportJSON").checked){
		document.getElementById("exportInfo").textContent = "Format: table with elements \{\"time\": timeSinceEpoch, \"thinking\": timeSpentThinking, \"pUser\": userPrediction, \"pMarket\": marketProbability, \"id\": marketId, \"bet\": bet \}. Bet is null if user didn't bet."
		document.getElementById("exportData").value = exportDataValue.json;
	} else {
		document.getElementById("exportInfo").textContent = "Date of prediction --- time spent thinking --- user probability --- market probability --- marketId --- did user bet? [--- bet size --- probability bet towards]"
		document.getElementById("exportData").value = exportDataValue.human;
	}
}

const track = function() {
	document.getElementById('mainDiv').style.display = "none";
	document.getElementById('trackTab').style.display = "block";
	document.getElementById('identifier').value = userId;
	updateExport()
}

const exporting = async function() {
	if (userId.length == 0) {
		document.getElementById("exportSuccess").textContent = "Please identify.";
		return
	}

	const response = await fetch("/?" + JSON.stringify({"type": "export", "userId": userId}));

	try {
		actualResponse = await response.json()
		if (actualResponse.error) {
			alert(actualResponse.error);
			document.getElementById("exportSuccess").textContent = "Failed to export.";
		} else if (actualResponse.message) {
			alert(actualResponse.message);
			document.getElementById("exportSuccess").textContent = "Failed to export.";
		} else {
			predictionObject = actualResponse;
			exportDataValue.plain = actualResponse.map(prediction => plainText(prediction)).join("\n");
			exportDataValue.json = JSON.stringify(actualResponse)
			exportDataValue.human = actualResponse.map(prediction => humanText(prediction)).join("\n");
			if(predictionObject.length == 0) {
				document.getElementById("exportSuccess").textContent = "No predictions made under this identifier.";
			} else {
				document.getElementById("exportSuccess").textContent = "Export successful! Exported " + predictionObject.length + " predictions.";
			}
			updateExport()
		}
	} catch(e) {
		document.getElementById("exportSuccess").textContent = "Failed to export.";
		console.log(e)
	}
}

const filter = function() {
	document.getElementById('mainDiv').style.display = "none";
	document.getElementById('filterTab').style.display = "block";
}

const identify = function() {
	userId = document.getElementById("identifier").value
	if(userId.length != 0) {
		document.getElementById('success').hidden = false
		document.getElementById('success').textContent = "Identified as " + userId
	}
}

const closeTrack = function() {
	document.getElementById('trackTab').style.display = 'none';
	document.getElementById('mainDiv').style.display = 'block';
	document.getElementById('success').hidden=true;
	document.getElementById("exportSuccess").textContent="";
}

const info = function() {
	document.getElementById('infoTab').style.display = 'block';
	document.getElementById('mainDiv').style.display = 'none'
}

const closeInfo = function() {
	document.getElementById('infoTab').style.display='none';
	document.getElementById('mainDiv').style.display='block';
}

newMarketLoop();
fetchNetworkMarketsInChunks();
fetchFileSystemMarketsInChunks();
addMarkets();
newMarket();
