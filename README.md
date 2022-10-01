# netparser

## Parse and manipulate IPv4 and IPv6 network addresses

[![Build Status](https://travis-ci.org/demskie/netparser.svg?branch=master)](https://travis-ci.org/demskie/netparser) [![Coverage Status](https://coveralls.io/repos/github/demskie/netparser/badge.svg?branch=master)](https://coveralls.io/github/demskie/netparser?branch=master)
[![Dependency Status](https://david-dm.org/demskie/netparser/status.svg)](https://david-dm.org/demskie/netparser#info=dependencies&view=table)

## Installation

```bash
npm install netparser
```

## Examples

```js
import * as netparser from "netparser";

netparser.baseAddress("b011:a2c2:7328:cc01:4ee7:e2ec:6269:babf/73");
// returns 'b011:a2c2:7328:cc01:4e80::'

netparser.broadcastAddress("192.168.0.50/24");
// returns '192.168.0.255'

netparser.findUnusedSubnets("192.168.0.0/22", ["192.168.1.0/24", "192.168.2.32/30"]);
// returns ['192.168.0.0/24', '192.168.2.0/27', '192.168.2.36/30', '192.168.2.40/29', '192.168.2.48/28', '192.168.2.64/26', '192.168.2.128/25', '192.168.3.0/24']

netparser.ip(" [2001:db8:122:344:0:0:0::0:0:0:1] ");
// returns '2001:db8:122:344::1'

netparser.network(" 192.168.000.000/24 ");
// returns '192.168.0.0/24'

netparser.networkComesBefore("192.168.0.0/24", "10.0.0.0/8");
// returns false

netparser.networkContainsSubnet("192.168.0.0/16", "192.168.0.0/24");
// returns true

netparser.networksIntersect("192.168.0.0/23", "192.168.1.0/24");
// returns true

netparser.nextAddress("192.168.0.0");
// returns '192.168.0.1'

netparser.nextNetwork("192.168.0.0/24");
// returns '192.168.1.0/24'

netparser.rangeOfNetworks("192.168.1.2", "192.168.2.2");
// returns ['192.168.1.2/31', '192.168.1.4/30', '192.168.1.8/29', '192.168.1.16/28', '192.168.1.32/27', '192.168.1.64/26', '192.168.1.128/25', '192.168.2.0/31', '192.168.2.2/32']

netparser.sort(["255.255.255.255", "192.168.0.0/16", "192.168.2.3/31"]);
// returns ['192.168.0.0/16', '192.168.2.3/31', '255.255.255.255/32']

netparser.summarize(["192.168.1.1", "192.168.0.0/16", "192.168.2.3/31"]);
// returns ['192.168.0.0/16']

var matcher = new netparser.Matcher(["192.168.0.0/24", "192.168.2.0/23", "192.168.4.0/24"]);
matcher.get("192.168.3.0");
// returns '192.168.0.0/24'
```

## FYI

- For simplicity, all functions will only ever return `String, String[], boolean, or null`.
- By default the library will fail silently and `null` is returned when errors are encountered. To override this setting set the optional `throwErrors` parameter to `True`.
- By default the library will conveniently mask out provided `network` values to their base address when such an operation makes sense. To override this setting set the optional `strict` parameter to `True` where applicable.

## Benchmarks

```bash
npm run bench

'index.bench.ts' output:
    baseAddress (netparser)        x 1,996,413 ops/sec ±0.37% (98 runs sampled)
    baseAddress (ip-address)       x 1,188,792 ops/sec ±4.63% (83 runs sampled)
    baseAddress (ipaddr.js)        x 825,180 ops/sec ±0.62% (93 runs sampled)
    baseAddress (netmask)          x 577,742 ops/sec ±1.79% (90 runs sampled)
    contains (netparser)           x 909,425 ops/sec ±1.81% (92 runs sampled)
    contains (ip-address)          x 925,975 ops/sec ±1.93% (89 runs sampled)
    contains (ipaddr.js)           x 43,187 ops/sec ±0.56% (94 runs sampled)
    contains (netmask)             x 489,932 ops/sec ±1.12% (91 runs sampled)

'match.bench.ts' output:
    create (netparser)             x 14.56 ops/sec ±1.19% (40 runs sampled)
    create (cidr-matcher)          x 7.99 ops/sec ±1.57% (24 runs sampled)
    create (ipaddr.js)             x 35.44 ops/sec ±4.72% (48 runs sampled)
    query (netparser)              x 159,486 ops/sec ±0.52% (92 runs sampled)
    query (cidr-matcher)           x 1,107 ops/sec ±1.55% (88 runs sampled)
    query (ipaddr.js)              x 14.54 ops/sec ±0.49% (40 runs sampled)
```
