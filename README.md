# netparser

## Parse and manipulate IPv4 and IPv6 network addresses.

[![Build Status](https://travis-ci.org/demskie/netparser.svg?branch=master)](https://travis-ci.org/demskie/netparser) [![Coverage Status](https://coveralls.io/repos/github/demskie/netparser/badge.svg?branch=master)](https://coveralls.io/github/demskie/netparser?branch=master)
[![Dependency Status](https://david-dm.org/demskie/netparser/status.svg)](https://david-dm.org/demskie/netparser#info=dependencies&view=table)

## Installation

```bash
npm install netparser
```

## Examples

```js
import netparser from 'netparser';

netparser.baseAddress('b011:a2c2:7328:cc01:4ee7:e2ec:6269:babf/73');
// returns 'b011:a2c2:7328:cc01:4e80::'

netparser.broadcastAddress('192.168.0.50/24');
// returns '192.168.0.255'

netparser.findUnusedSubnets('192.168.0.0/22', ['192.168.1.0/24', '192.168.2.32/30']);
// returns ['192.168.0.0/24', '192.168.2.0/27', '192.168.2.36/30', '192.168.2.40/29', '192.168.2.48/28', '192.168.2.64/26', '192.168.2.128/25', '192.168.3.0/24']

netparser.ip(' [2001:db8:122:344:0:0:0::0:0:0:1] ');
// returns '2001:db8:122:344::1'

netparser.network(' 192.168.000.000/24 ');
// returns '192.168.0.0/24'

netparser.networkComesBefore('192.168.0.0/24', '10.0.0.0/8');
// returns false

netparser.networkContainsSubnet('192.168.0.0/16', '192.168.0.0/24');
// returns true

netparser.networksIntersect('192.168.0.0/23', '192.168.1.0/24');
// returns true

netparser.nextAddress('192.168.0.0');
// returns '192.168.0.1'

netparser.nextNetwork('192.168.0.0/24');
// returns '192.168.1.0/24'

netparser.rangeOfNetworks('192.168.1.2', '192.168.2.2');
// returns ['192.168.1.2/31', '192.168.1.4/30', '192.168.1.8/29', '192.168.1.16/28', '192.168.1.32/27', '192.168.1.64/26', '192.168.1.128/25', '192.168.2.0/31', '192.168.2.2/32']

netparser.sort(['255.255.255.255', '192.168.0.0/16', '192.168.2.3/31']);
// returns ['192.168.0.0/16', '192.168.2.3/31', '255.255.255.255/32']

netparser.summarize(['192.168.1.1', '192.168.0.0/16', '192.168.2.3/31']);
// returns ['192.168.0.0/16']

let matcher = new netparser.Matcher();
matcher.add("192.168.0.0/24");
matcher.add("192.168.2.0/23");
matcher.add("192.168.4.0/24");
matcher.has("192.168.3.0"); // returns true
```

## FYI

- For simplicity, all functions will only ever return `String, String[], boolean, or null`.
- By default the library will fail silently and `null` is returned when errors are encountered. To override this setting set the optional `throwErrors` parameter to `True`.
- By default the library will conveniently mask out provided `network` values to their base address when such an operation makes sense. To override this setting set the optional `strict` parameter to `True` where applicable.

## Benchmarks

```bash
npm run bench

'index.bench.ts' output:
        baseAddress (netparser)        x 1,543,101 ops/sec ±3.49% (80 runs sampled)
        baseAddress (ip-address)       x 1,200,247 ops/sec ±1.29% (89 runs sampled)
        baseAddress (ipaddr.js)        x 436,374 ops/sec ±2.02% (85 runs sampled)
        baseAddress (netmask)          x 352,156 ops/sec ±0.97% (90 runs sampled)
        contains (netparser)           x 822,829 ops/sec ±1.03% (89 runs sampled)
        contains (ip-address)          x 832,419 ops/sec ±1.35% (88 runs sampled)
        contains (ipaddr.js)           x 74,829 ops/sec ±1.71% (86 runs sampled)
        contains (netmask)             x 307,760 ops/sec ±1.14% (89 runs sampled)

'match.bench.ts' output:
        create (netparser)             x 16.99 ops/sec ±5.11% (36 runs sampled)
        create (cidr-matcher)          x 9.18 ops/sec ±2.99% (27 runs sampled)
        create (ipaddr.js)             x 25.16 ops/sec ±6.47% (45 runs sampled)
        query (netparser)              x 239,542 ops/sec ±6.67% (86 runs sampled)
        query (cidr-matcher)           x 1,123 ops/sec ±1.36% (84 runs sampled)
        query (ipaddr.js)              x 15.81 ops/sec ±1.37% (43 runs sampled)

'sort.bench.ts' output:
        sort n=100 (native)            x 16,666 ops/sec ±2.02% (88 runs sampled)
        sort n=100 (insertion)         x 42,144 ops/sec ±1.23% (85 runs sampled)
        sort n=100 (radix msd)         x 360 ops/sec ±1.15% (83 runs sampled)
        sort n=1000 (native)           x 1,273 ops/sec ±1.31% (80 runs sampled)
        sort n=1000 (insertion)        x 2,243 ops/sec ±0.83% (88 runs sampled)
        sort n=1000 (radix msd)        x 36.37 ops/sec ±1.21% (50 runs sampled)
        sort n=10000 (native)          x 91.33 ops/sec ±1.46% (67 runs sampled)
        sort n=10000 (insertion)       x 73.01 ops/sec ±1.58% (74 runs sampled)
        sort n=10000 (radix msd)       x 3.71 ops/sec ±1.48% (14 runs sampled)
        sort n=100000 (native)         x 4.49 ops/sec ±5.69% (16 runs sampled)
        sort n=100000 (insertion)      x 0.39 ops/sec ±0.39% (5 runs sampled)
        sort n=100000 (radix msd)      x 0.36 ops/sec ±4.99% (5 runs sampled)
```

## API
Docs generated using [`docts`](https://github.com/charto/docts)
>
> <a name="api-baseAddress"></a>
> ### Function [`baseAddress`](#api-baseAddress)
> <em>BaseAddress returns the base address for a given subnet address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L22-L27)  
> > **baseAddress( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L22-L27)  
> > &emsp;&#x25aa; networkAddress <sup><code>string</code></sup> <em>- A network address like 192.168.0.4/24</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-broadcastAddress"></a>
> ### Function [`broadcastAddress`](#api-broadcastAddress)
> <em>BroadcastAddress returns the broadcast address for an IPv4 address.</em>  
> <em>Please note that IPv6 does not have broadcast addresses.</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L41-L46)  
> > **broadcastAddress( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L41-L46)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-findUnusedSubnets"></a>
> ### Function [`findUnusedSubnets`](#api-findUnusedSubnets)
> <em>FindUnusedSubnets returns array of unused subnets given the aggregate and sibling subnets</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L61-L88)  
> > **findUnusedSubnets( )** <sup>&rArr; <code>null | string[]</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L61-L88)  
> > &emsp;&#x25aa; aggregate <sup><code>string</code></sup> <em>- An aggregate network like 192.168.0.0/24</em>  
> > &emsp;&#x25aa; subnets <sup><code>string[]</code></sup> <em>- Array of subnetworks like ["192.168.0.0/24", "192.168.0.128/26"]</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-ip"></a>
> ### Function [`ip`](#api-ip)
> <em>Parse an IP address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L101-L104)  
> > **ip( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L101-L104)  
> > &emsp;&#x25aa; address <sup><code>string</code></sup> <em>- Either an address like 192.168.0.0 or subnet 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-network"></a>
> ### Function [`network`](#api-network)
> <em>Parse a network address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L117-L120)  
> > **network( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L117-L120)  
> > &emsp;&#x25aa; networkAddress <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-networkComesBefore"></a>
> ### Function [`networkComesBefore`](#api-networkComesBefore)
> <em>NetworkComesBefore returns a bool with regards to numerical network order.</em>  
> <em>Please note that IPv4 comes before IPv6 and larger networks come before smaller ones.</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L136-L149)  
> > **networkComesBefore( )** <sup>&rArr; <code>null | true | false</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L136-L149)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25aa; otherNetwork <sup><code>string</code></sup> <em>- A network like 192.168.1.0/24</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-networkContainsAddress"></a>
> ### Function [`networkContainsAddress`](#api-networkContainsAddress)
> <em>NetworkContainsAddress validates that the address is inside the network</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L164-L174)  
> > **networkContainsAddress( )** <sup>&rArr; <code>null | true | false</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L164-L174)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25aa; address <sup><code>string</code></sup> <em>- A network like 192.168.0.100</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-networkContainsSubnet"></a>
> ### Function [`networkContainsSubnet`](#api-networkContainsSubnet)
> <em>NetworkContainsSubnet validates that the network is a valid supernet</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L189-L195)  
> > **networkContainsSubnet( )** <sup>&rArr; <code>null | true | false</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L189-L195)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/16</em>  
> > &emsp;&#x25aa; subnet <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-networksIntersect"></a>
> ### Function [`networksIntersect`](#api-networksIntersect)
> <em>NetworksIntersect returns a bool showing if the networks overlap</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L210-L216)  
> > **networksIntersect( )** <sup>&rArr; <code>null | true | false</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L210-L216)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/23</em>  
> > &emsp;&#x25aa; otherNetwork <sup><code>string</code></sup> <em>- A network like 192.168.1.0/24</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-nextAddress"></a>
> ### Function [`nextAddress`](#api-nextAddress)
> <em>NextAddress returns the next address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L229-L237)  
> > **nextAddress( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L229-L237)  
> > &emsp;&#x25aa; address <sup><code>string</code></sup> <em>- An address like 192.168.0.0</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-nextNetwork"></a>
> ### Function [`nextNetwork`](#api-nextNetwork)
> <em>NextNetwork returns the next network of the same size.</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L251-L259)  
> > **nextNetwork( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L251-L259)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-rangeOfNetworks"></a>
> ### Function [`rangeOfNetworks`](#api-rangeOfNetworks)
> <em>RangeOfNetworks returns an array of networks given a range of addresses</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L273-L300)  
> > **rangeOfNetworks( )** <sup>&rArr; <code>null | string[]</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L273-L300)  
> > &emsp;&#x25aa; startAddress <sup><code>string</code></sup> <em>- An address like 192.168.1.2</em>  
> > &emsp;&#x25aa; stopAddress <sup><code>string</code></sup> <em>- An address like 192.168.1.5</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-sort"></a>
> ### Function [`sort`](#api-sort)
> <em>Sort returns an array of sorted networks</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L313-L341)  
> > **sort( )** <sup>&rArr; <code>null | string[]</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L313-L341)  
> > &emsp;&#x25aa; networkAddresses <sup><code>string[]</code></sup> <em>- An array of addresses or subnets</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-summarize"></a>
> ### Function [`summarize`](#api-summarize)
> <em>Summarize returns an array of aggregates given a list of networks</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L355-L375)  
> > **summarize( )** <sup>&rArr; <code>null | string[]</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L355-L375)  
> > &emsp;&#x25aa; networks <sup><code>string[]</code></sup> <em>- An array of addresses or subnets</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
