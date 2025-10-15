 

// Reflection: 
// For this assignment I was able to follow the TDD cycle. On one hand it was nice having this sort of 
// structure when developing my code.
// On the other it is a strange development process shift. I can appreciate the fact that it helps
//  make more reliable code, and it can be cleaner in many ways. My problem is the learning process, so things 
// felt slower this time around. I'm willing to bet long term this is a better method than code then build tests.  


const { Portfolio } = require('./portfolio');

describe('Stock Portfolio (TDD increments)', () => {
  // 2.1 A portfolio starts empty (no symbols, no shares)
  test('2.1: new portfolio has no symbols and no shares', () => {
    const p = new Portfolio();
    expect(p.uniqueCount()).toBe(0);
    expect(p.isEmpty()).toBe(true); // anticipates 2.2
  });

  // 2.2 isEmpty
  test('2.2: isEmpty reports true for empty, false after purchase', () => {
    const p = new Portfolio();
    expect(p.isEmpty()).toBe(true);
    p.buy('GME', 5);
    expect(p.isEmpty()).toBe(false);
  });

  // 2.3 purchase adds shares (accumulates)
  test('2.3: buy adds and accumulates shares for a symbol', () => {
    const p = new Portfolio();
    p.buy('RBLX', 10);
    expect(p.sharesOf('RBLX')).toBe(10);
    p.buy('RBLX', 5);
    expect(p.sharesOf('RBLX')).toBe(15);
  });

  // 2.4 sale subtracts shares
  test('2.4: sell subtracts shares for a symbol', () => {
    const p = new Portfolio();
    p.buy('GME', 8);
    p.sell('GME', 3);
    expect(p.sharesOf('GME')).toBe(5);
  });

  // 2.5 unique ticker count
  test('2.5: uniqueCount counts distinct symbols, not total shares', () => {
    const p = new Portfolio();
    p.buy('GME', 5);
    p.buy('RBLX', 10);
    expect(p.uniqueCount()).toBe(2);
    p.buy('GME', 1);
    expect(p.uniqueCount()).toBe(2); // still two unique symbols
  });

  // 2.6 keep only owned symbols (no zero-share entries)
  test('2.6: symbols with zero shares are removed from the portfolio', () => {
    const p = new Portfolio();
    p.buy('GME', 3);
    p.sell('GME', 3); // now zero
    expect(p.sharesOf('GME')).toBe(0);
    expect(p.uniqueCount()).toBe(0);
    expect(p.isEmpty()).toBe(true);
  });

  // 2.7 sharesOf for given symbol, 0 if not present
  test('2.7: sharesOf returns 0 for missing symbol', () => {
    const p = new Portfolio();
    expect(p.sharesOf('AAPL')).toBe(0);
  });

  // 2.8 cannot oversell; throw with exact message
  test("2.8: selling more than owned throws 'Not possible to sell this number of shares.'", () => {
    const p = new Portfolio();
    p.buy('MSFT', 4);
    expect(() => p.sell('MSFT', 5)).toThrow('Not possible to sell this number of shares.');
  });

  // Independent symbols do not interfere
  test('independent symbols remain independent', () => {
    const p = new Portfolio();
    p.buy('AAPL', 2);
    p.buy('MSFT', 3);
    p.sell('AAPL', 1);
    expect(p.sharesOf('AAPL')).toBe(1);
    expect(p.sharesOf('MSFT')).toBe(3);
    expect(p.uniqueCount()).toBe(2);
  });

  // Minimal input validation 
  test('buy/sell require positive integer shares', () => {
    const p = new Portfolio();
    expect(() => p.buy('GME', 0)).toThrow();
    expect(() => p.buy('GME', -1)).toThrow();
    expect(() => p.sell('GME', 0)).toThrow();
    expect(() => p.sell('GME', -2)).toThrow();
    expect(() => p.buy('GME', 1.5)).toThrow();
  });

  test('symbols must be non-empty strings', () => {
    const p = new Portfolio();
    expect(() => p.buy('', 1)).toThrow();
    expect(() => p.buy('   ', 1)).toThrow();
    expect(() => p.sell('', 1)).toThrow();
  });
});