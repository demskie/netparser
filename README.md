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
import * as netparser from 'netparser';

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

var matcher = new netparser.Matcher(['192.168.0.0/24', '192.168.2.0/23', '192.168.4.0/24']);
matcher.has('192.168.3.0');
// returns true
```

## FYI

- For simplicity, all functions will only ever return `String, String[], boolean, or null`.
- By default the library will fail silently and `null` is returned when errors are encountered. To override this setting set the optional `throwErrors` parameter to `True`.
- By default the library will conveniently mask out provided `network` values to their base address when such an operation makes sense. To override this setting set the optional `strict` parameter to `True` where applicable.

## Benchmarks

```bash
npm run bench

'index.bench.ts' output:
    baseAddress (netparser)        x 1,881,378 ops/sec ±0.66% (95 runs sampled)
    baseAddress (ip-address)       x 1,355,975 ops/sec ±0.64% (88 runs sampled)
    baseAddress (ipaddr.js)        x 509,825 ops/sec ±2.07% (89 runs sampled)
    baseAddress (netmask)          x 326,042 ops/sec ±3.84% (82 runs sampled)
    contains (netparser)           x 883,418 ops/sec ±1.53% (84 runs sampled)
    contains (ip-address)          x 901,704 ops/sec ±1.44% (90 runs sampled)
    contains (ipaddr.js)           x 59,005 ops/sec ±13.38% (65 runs sampled)
    contains (netmask)             x 304,785 ops/sec ±1.77% (88 runs sampled)

'match.bench.ts' output:
    create (netparser)             x 11.91 ops/sec ±5.55% (34 runs sampled)
    create (cidr-matcher)          x 5.13 ops/sec ±5.43% (17 runs sampled)
    create (ipaddr.js)             x 28.78 ops/sec ±4.83% (50 runs sampled)
    query (netparser)              x 145,604 ops/sec ±1.25% (91 runs sampled)
    query (cidr-matcher)           x 1,035 ops/sec ±3.74% (83 runs sampled)
    query (ipaddr.js)              x 16.22 ops/sec ±1.76% (44 runs sampled)
```

## API
Docs generated using [`docts`](https://github.com/charto/docts)
>
> <a name="api-baseAddress"></a>
> ### Function [`baseAddress`](#api-baseAddress)
> <em>BaseAddress returns the base address for a given subnet address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L22-L27)  
> > **baseAddress( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L22-L27)  
> > &emsp;&#x25aa; networkAddress <sup><code>string</code></sup> <em>- A network address like 192.168.0.4/24</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-broadcastAddress"></a>
> ### Function [`broadcastAddress`](#api-broadcastAddress)
> <em>BroadcastAddress returns the broadcast address for an IPv4 address.</em>  
> <em>Please note that IPv6 does not have broadcast addresses.</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L41-L46)  
> > **broadcastAddress( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L41-L46)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-findUnusedSubnets"></a>
> ### Function [`findUnusedSubnets`](#api-findUnusedSubnets)
> <em>FindUnusedSubnets returns array of unused subnets given the aggregate and sibling subnets</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L61-L78)  
> > **findUnusedSubnets( )** <sup>&rArr; <code>null | string[]</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L61-L78)  
> > &emsp;&#x25aa; aggregate <sup><code>string</code></sup> <em>- An aggregate network like 192.168.0.0/24</em>  
> > &emsp;&#x25aa; subnets <sup><code>string[]</code></sup> <em>- Array of subnetworks like ["192.168.0.0/24", "192.168.0.128/26"]</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-ip"></a>
> ### Function [`ip`](#api-ip)
> <em>Parse an IP address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L91-L94)  
> > **ip( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L91-L94)  
> > &emsp;&#x25aa; address <sup><code>string</code></sup> <em>- Either an address like 192.168.0.0 or subnet 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-network"></a>
> ### Function [`network`](#api-network)
> <em>Parse a network address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L107-L110)  
> > **network( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L107-L110)  
> > &emsp;&#x25aa; networkAddress <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-networkComesBefore"></a>
> ### Function [`networkComesBefore`](#api-networkComesBefore)
> <em>NetworkComesBefore returns a bool with regards to numerical network order.</em>  
> <em>Please note that IPv4 comes before IPv6 and larger networks come before smaller ones.</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L126-L139)  
> > **networkComesBefore( )** <sup>&rArr; <code>null | true | false</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L126-L139)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25aa; otherNetwork <sup><code>string</code></sup> <em>- A network like 192.168.1.0/24</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-networkContainsAddress"></a>
> ### Function [`networkContainsAddress`](#api-networkContainsAddress)
> <em>NetworkContainsAddress validates that the address is inside the network</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L154-L164)  
> > **networkContainsAddress( )** <sup>&rArr; <code>null | true | false</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L154-L164)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25aa; address <sup><code>string</code></sup> <em>- A network like 192.168.0.100</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-networkContainsSubnet"></a>
> ### Function [`networkContainsSubnet`](#api-networkContainsSubnet)
> <em>NetworkContainsSubnet validates that the network is a valid supernet</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L179-L185)  
> > **networkContainsSubnet( )** <sup>&rArr; <code>null | true | false</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L179-L185)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/16</em>  
> > &emsp;&#x25aa; subnet <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-networksIntersect"></a>
> ### Function [`networksIntersect`](#api-networksIntersect)
> <em>NetworksIntersect returns a bool showing if the networks overlap</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L200-L206)  
> > **networksIntersect( )** <sup>&rArr; <code>null | true | false</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L200-L206)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/23</em>  
> > &emsp;&#x25aa; otherNetwork <sup><code>string</code></sup> <em>- A network like 192.168.1.0/24</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-nextAddress"></a>
> ### Function [`nextAddress`](#api-nextAddress)
> <em>NextAddress returns the next address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L219-L227)  
> > **nextAddress( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L219-L227)  
> > &emsp;&#x25aa; address <sup><code>string</code></sup> <em>- An address like 192.168.0.0</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-nextNetwork"></a>
> ### Function [`nextNetwork`](#api-nextNetwork)
> <em>NextNetwork returns the next network of the same size.</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L241-L249)  
> > **nextNetwork( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L241-L249)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-rangeOfNetworks"></a>
> ### Function [`rangeOfNetworks`](#api-rangeOfNetworks)
> <em>RangeOfNetworks returns an array of networks given a range of addresses</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L263-L288)  
> > **rangeOfNetworks( )** <sup>&rArr; <code>null | string[]</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L263-L288)  
> > &emsp;&#x25aa; startAddress <sup><code>string</code></sup> <em>- An address like 192.168.1.2</em>  
> > &emsp;&#x25aa; stopAddress <sup><code>string</code></sup> <em>- An address like 192.168.1.5</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-sort"></a>
> ### Function [`sort`](#api-sort)
> <em>Sort returns an array of sorted networks</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L301-L329)  
> > **sort( )** <sup>&rArr; <code>null | string[]</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L301-L329)  
> > &emsp;&#x25aa; networkAddresses <sup><code>string[]</code></sup> <em>- An array of addresses or subnets</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-summarize"></a>
> ### Function [`summarize`](#api-summarize)
> <em>Summarize returns an array of aggregates given a list of networks</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L343-L363)  
> > **summarize( )** <sup>&rArr; <code>null | string[]</code></sup> [`<>`](http://github.com/demskie/netparser/blob/63db838/src/index.ts#L343-L363)  
> > &emsp;&#x25aa; networks <sup><code>string[]</code></sup> <em>- An array of addresses or subnets</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
