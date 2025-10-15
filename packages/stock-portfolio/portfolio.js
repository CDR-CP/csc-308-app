// portfolio.js
// basic stock portfolio thing
// TDD assignment - stock tracker (buy, sell, count, etc.)

class Portfolio {
    constructor() {
        // just using a Map for ticker -> shares
        this._holdings = new Map()
    }

    // check if portfolio empty
    isEmpty() {
      return this._holdings.size === 0
    }

    // how many unique ticker symbols we have
    uniqueCount() {
        return this._holdings.size
    }

    // how many shares for this symbol, or 0 if not there
    sharesOf(symbol) {
      return this._holdings.get(symbol) ?? 0
    }

    // buy some shares of a symbol
    buy(symbol, shares){
        this._assertValidSymbol(symbol)
        this._assertPositiveInt(shares)

        const curr = this.sharesOf(symbol)
        const total = curr + shares
        this._holdings.set(symbol, total)
    }

    // sell shares for a symbol (can’t oversell)
    sell(symbol, shares) {
        this._assertValidSymbol(symbol)
        this._assertPositiveInt(shares)

        const curr = this.sharesOf(symbol)
        if (shares > curr) {
            throw new Error('Not possible to sell this number of shares.')
        }

        const remaining = curr - shares

        // if none left, remove ticker entirely
        if (remaining === 0){
          this._holdings.delete(symbol)
        } else {
          this._holdings.set(symbol, remaining)
        }
    }

    // small helpers below ---------------------

    _assertPositiveInt(val){
      if (!Number.isInteger(val) || val <= 0){
          throw new Error('shares must be a positive integer')
      }
    }

    _assertValidSymbol(sym){
      // not gonna allow blank symbols
      if (typeof sym !== 'string' || sym.trim() === ''){
          throw new Error('symbol must be a non-empty string')
      }
    }
}

module.exports = { Portfolio }
