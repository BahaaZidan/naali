// TODO: we shouldn't use regex at all. find another solution.

// PnYnMnWnDTnHnMnS
const numbers = '\\d+';
const fractionalNumbers = `${numbers}(?:[\\.,]${numbers})?`;
const datePattern = `(${numbers}Y)?(${numbers}M)?(${numbers}W)?(${numbers}D)?`;
const timePattern = `T(${fractionalNumbers}H)?(${fractionalNumbers}M)?(${fractionalNumbers}S)?`;

const iso8601 = `P(?:${datePattern}(?:${timePattern})?)`;
/**
 * The ISO8601 regex for matching / testing durations
 */
const pattern = new RegExp(iso8601);

const objMap: (keyof Duration)[] = [
	'years',
	'months',
	'weeks',
	'days',
	'hours',
	'minutes',
	'seconds'
];

export const parseIsoDurationString = (durationString: string): Duration => {
	const matches = durationString.replace(/,/g, '.').match(pattern);
	if (!matches) {
		throw new RangeError(`invalid duration: ${durationString}`);
	}
	// Slice away first entry in match-array (the input string)
	const slicedMatches: (string | undefined)[] = matches.slice(1);
	if (slicedMatches.filter((v) => v != null).length === 0) {
		throw new RangeError(`invalid duration: ${durationString}`);
	}
	// Check only one fraction is used
	if (slicedMatches.filter((v) => /\./.test(v || '')).length > 1) {
		throw new RangeError(`only the smallest unit can be fractional`);
	}

	return slicedMatches.reduce((prev, next, idx) => {
		prev[objMap[idx]] = parseFloat(next || '0') || 0;
		return prev;
	}, {} as Duration);
};

interface Duration {
	years?: number;
	months?: number;
	weeks?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
}
