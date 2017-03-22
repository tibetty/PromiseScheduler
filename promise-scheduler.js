#!/usr/bin/env node
'use strict';

// const assert = require('assert');	// for debug purpose only

class PromiseScheduler {
	constructor(maxConcurrency) {
		this._queue = [];
		this._concurrencyCount = 0;
		this._maxConcurrency = maxConcurrency || 10;
	}
	
	submit(promFunc, params, thenCb, catchCb) {
		// assert(typeof promFunc === 'function');	// for debug purpose only
		if (typeof promFunc !== 'function') return;
		if (params && params.constructor !== Array) return;

		let self = this;
		
		function schedule() {
			self._concurrencyCount--;
			if (self._queue.length > 0 && self._concurrencyCount < self._maxConcurrency) {
				self._concurrencyCount++;	// markup first, and then issue
				let promiseTuple = self._queue.shift();
				let promise = promiseTuple.promFunc.apply(null, promiseTuple.params)
				promise.then(value => {
					if (promiseTuple.thenCb && typeof promiseTuple.thenCb === 'function')
						promiseTuple.thenCb.call(null, value);
					schedule();
				}).catch(err => {
					if (promiseTuple.catchCb && typeof promiseTuple.catchCb === 'function')
						promiseTuple.catchCb.call(null, err);
					schedule();
				});
			}
		}

		if (this._concurrencyCount < this._maxConcurrency) {
			this._concurrencyCount++;		// markup first, and then issue
			let promise = promFunc.apply(null, params);
			promise.then(value => {
				if (thenCb && typeof thenCb === 'function')
					thenCb.call(null, value);
				schedule();
			}).catch(err => {
				if (catchCb && typeof catchCb === 'function')
					catchCb.call(null, err);
				schedule();
			});
		} else this._queue.push({
			promFunc: promFunc,
			params: params,
			thenCb: thenCb,
			catchCb: catchCb
		});
	}
}

module.exports = PromiseScheduler;