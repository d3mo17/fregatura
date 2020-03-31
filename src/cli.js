#!/usr/bin/env node

const moment = require('moment');
const chalk = require('chalk');
const padStart = require('string.prototype.padstart')

/**
 * @param {object} argv 
 */
export function cli(argv) {
	if (argv['v'] || argv['h'] || argv['help']) {
		var pjson = require('../package.json');
		console.log('');
		console.log(pjson.name + ' v' + pjson.version);
	}
	
	if (argv['h'] || argv['help']) {
		console.log('');
		console.log('command: fregatura [OPTIONS]...');
		console.log('');
		console.log(pjson.description);
		console.log('');
		console.log('Arguments:');
		console.log('  -b, --balance   Balance to start with. Default: 185000');
		console.log('  -c, --currency  Currency, default: €');
		console.log('  -f, --from      Date from which to start (format: "YYYY-MM-DD", default: [today])');
		console.log('  -h, --help      This help text');
		console.log('  -i, --interest  Interest in percent per annum. Default: 2.5');
		console.log('  -r, --rate      Fixed rate to pay monthly. Default: 750');
		console.log('  -t, --to        Date to end (format: "YYYY-MM-DD", default: [current year] + 100)');
	}
	
	(argv['v'] || argv['h'] || argv['help']) && process.exit()

	let balance       = argv['b'] || argv['balance'] || 185000;
	let fixedInterest = argv['i'] || argv['interest'] ||2.5;
	let fixedRate     = argv['r'] || argv['rate'] || 750;
	let currency      = argv['c'] || argv['currency'] ||'€';
	
	let from = argv['f'] || argv['from']
		? moment(argv['f'] || argv['from'])
		: moment();
	let to   = argv['t'] || argv['to']
		? moment(argv['t'] || argv['to'])
		: moment().year(moment().year() + 100);
	
	let months = to.diff(from, 'months');
	
	console.log('')
	
	// Table head
	console.log(chalk['bgBlue'].white.bold([
		' ',
		padStart('Date', 8),
		padStart('Balance', 14),
		padStart('Interest Rate', 17),
		padStart('Repayment', 11),
		padStart('Fixed Rate', 12),
		padStart('New Balance', 15),
		' '
	].join(' ')));
	console.log(chalk['bgBlue'].white.bold([
		padStart('', 25),
		padStart(fixedInterest + '% per annum', 17),
		padStart('', 42)
	].join(' ')));
	
	/**
	 * @param {*} num 
	 */
	function numberFormat(num) {
		return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2 });
	}
	
	let yearToggle = true
	from.subtract(1, 'month');
	// Each month one row ...
	for (let i = 0; i <= months; i++) {
			let bgColor = i%2 ? 'bgBlackBright': 'bgBlack';
			let color = i%2 ? 'whiteBright': 'white';
			let yearMem = from.format('YYYY');
			from.add(1, 'month');
			
			yearToggle = (
				parseInt(from.format('YYYY', 10))
				- parseInt(yearMem, 10)
			) % 2 === 1 ? !yearToggle : yearToggle;
			let fontThickness = yearToggle ? chalk['reset'] : chalk['bold'];
			
			let interestSumMonth = balance * fixedInterest / 100 / 12;
			let repayment = (fixedRate - interestSumMonth.toFixed(2)).toFixed(2);
			let newBalance;
			
			if (balance < repayment) {
				newBalance = 0;
				repayment = balance;
				fixedRate = (interestSumMonth + repayment).toFixed(2);
			} else {
				newBalance = parseFloat(balance.toFixed(2) - repayment).toFixed(2);
			}
	
			console.log(fontThickness[bgColor][color](padStart('', 86)));
			console.log(fontThickness[bgColor][color]([
				' ',
				padStart(from.format('MMM YYYY'), 8),
				padStart(numberFormat(balance.toFixed(2)) + ' ' + currency, 14),
				padStart(numberFormat(interestSumMonth.toFixed(2)) + ' ' + currency, 17),
				padStart(numberFormat(repayment) + ' ' + currency, 11),
				padStart(numberFormat(fixedRate) + ' ' + currency, 12),
				padStart(numberFormat(newBalance) + ' ' + currency, 15),
				' '
			].join(' ')));
			
			if (newBalance === 0 ) {
				break;
			}
	
			balance = parseFloat(newBalance);
	}
}
