#!/usr/bin/env node

const moment = require('moment')

/**
 * @param {object} argv 
 */
export function cli(argv) {
	let formatter
	if (argv['v'] || argv['version'] || argv['h'] || argv['help']) {
		var pjson = require('../package.json')
		console.log('')
		console.log(pjson.name + ' v' + pjson.version)
	}
	
	if (argv['h'] || argv['help']) {
		console.log('')
		console.log('command: fregatura [OPTIONS]...')
		console.log('')
		console.log(pjson.description)
		console.log('')
		console.log('Arguments:')
		console.log('  -b, --balance        Balance to start with. Default: 185000')
		console.log('  -c, --currency       Currency, default: €')
		console.log('  -f, --from           Date from which to start (format: "YYYY-MM-DD", default: [today])')
		console.log('  -h, --help           This help text')
		console.log('  -i, --interest       Interest in percent per annum. Default: 2.5')
		console.log('  -p, --repaymentRate  Initial repayment rate in percent. No Default')
		console.log('  -r, --rate           Fixed rate to pay monthly. Default: 750')
		console.log('  -t, --to             Date to end (format: "YYYY-MM-DD", default: [current year] + 100)')
		console.log('  -v, --version        Output version number')
	}
	
	(argv['v'] || argv['version'] || argv['h'] || argv['help']) && process.exit()

	let balance = argv['b'] || argv['balance'] || 185000
	let fixedInterest = argv['i'] || argv['interest'] || 2.5
	let repaymentRate = argv['p'] || argv['repaymentRate']
	let fixedRate
	if (repaymentRate) {
		fixedRate = (balance * (repaymentRate + fixedInterest) / 100 / 12).toFixed(2)
	} else {
		fixedRate = argv['r'] || argv['rate'] || 750
		repaymentRate = (fixedRate * 12 * 100 / balance) - fixedInterest
	}
	let currency = argv['c'] || argv['currency'] || '€'
	
	let from = argv['f'] || argv['from']
		? moment(argv['f'] || argv['from'])
		: moment()
	let to   = argv['t'] || argv['to']
		? moment(argv['t'] || argv['to'])
		: moment().year(moment().year() + 100)
	
	let months = to.diff(from, 'months')

	formatter = require('./formatter/BaseFormatter').create(process.stdout, currency)
	
	formatter.begin()
	formatter.writeHeaderRow(
		['Date', 'Balance', 'Interest Rate', 'Repayment', 'Fixed Rate', 'New Balance']
	)
	formatter.writeHeaderRow(
		['', '', fixedInterest + '% per annum', '', 'init. ' + repaymentRate.toFixed(2) + '%', '']
	)
	
	/**
	 * @param {*} num 
	 */
	function numberFormat(num) {
		return parseFloat(num).toLocaleString('en-US', { minimumFractionDigits: 2 })
	}
	
	// Each month one row ...
	for (let i = 0; i <= months; i++) {
		let interestSumMonth = balance * fixedInterest / 100 / 12
		let repayment = (fixedRate - interestSumMonth.toFixed(2)).toFixed(2)
		let newBalance

		if (balance < repayment) {
			newBalance = 0
			repayment = balance
			fixedRate = (interestSumMonth + repayment).toFixed(2)
		} else {
			newBalance = parseFloat(balance.toFixed(2) - repayment).toFixed(2)
		}

		formatter.writeRow([
			from,
			numberFormat(balance.toFixed(2)),
			numberFormat(interestSumMonth.toFixed(2)),
			numberFormat(repayment),
			numberFormat(fixedRate),
			numberFormat(newBalance)
		], {
			balance: balance,
			fixedRate: fixedRate,
			fixedInterest: fixedInterest
		});

		if (newBalance === 0) {
			break
		}

		from.add(1, 'month')
		balance = parseFloat(newBalance)
	}

	formatter.end()
}
