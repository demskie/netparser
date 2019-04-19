# netparser

#### Parse and manipulate IPv4 and IPv6 network addresses.

[![Build Status](https://travis-ci.org/demskie/netparser.svg?branch=master)](https://travis-ci.org/demskie/netparser) [![Coverage Status](https://coveralls.io/repos/github/demskie/netparser/badge.svg?branch=master)](https://coveralls.io/github/demskie/netparser?branch=master)

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

netparser.nextNetwork('192.168.0.0/24');
// returns '192.168.1.0/24'

netparser.rangeOfNetworks('192.168.1.2', '192.168.2.2');
// returns ['192.168.1.2/31', '192.168.1.4/30', '192.168.1.8/29', '192.168.1.16/28', '192.168.1.32/27', '192.168.1.64/26', '192.168.1.128/25', '192.168.2.0/31', '192.168.2.2/32']
```

## FYI

- For simplicity, the above functions will only ever return `String, String[] or null`.
- By default the library will fail silently and `null` is returned when errors are encountered. To override this setting set the optional `throwErrors` parameter to `True`.
- By default the library will conveniently mask out provided `network` values to their base address when such an operation makes sense. To override this setting set the optional `strict` parameter to `True` where applicable.

## API
Docs generated using [`docts`](https://github.com/charto/docts)
>
> <a name="api-baseAddress"></a>
> ### Function [`baseAddress`](#api-baseAddress)
> <em>BaseAddress returns the base address for a given subnet address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L15-L30)  
> > **baseAddress( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L15-L30)  
> > &emsp;&#x25aa; networkAddress <sup><code>string</code></sup> <em>- A network address like 192.168.0.4/24</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-broadcastAddress"></a>
> ### Function [`broadcastAddress`](#api-broadcastAddress)
> <em>BroadcastAddress returns the broadcast address for an IPv4 address.</em>  
> <em>Please note that IPv6 does not have broadcast addresses.</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L44-L52)  
> > **broadcastAddress( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L44-L52)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-findUnusedSubnets"></a>
> ### Function [`findUnusedSubnets`](#api-findUnusedSubnets)
> <em>FindUnusedSubnets returns array of unused subnets given the aggregate and sibling subnets</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L67-L100)  
> > **findUnusedSubnets( )** <sup>&rArr; <code>null | string | string[]</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L67-L100)  
> > &emsp;&#x25aa; aggregate <sup><code>string</code></sup> <em>- An aggregate network like 192.168.0.0/24</em>  
> > &emsp;&#x25aa; subnets <sup><code>string[]</code></sup> <em>- Array of subnetworks like ["192.168.0.0/24", "192.168.0.128/26"]</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-ip"></a>
> ### Function [`ip`](#api-ip)
> <em>Parse an IP address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L113-L126)  
> > **ip( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L113-L126)  
> > &emsp;&#x25aa; address <sup><code>string</code></sup> <em>- Either an address like 192.168.0.0 or subnet 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-network"></a>
> ### Function [`network`](#api-network)
> <em>Parse a network address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L139-L154)  
> > **network( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L139-L154)  
> > &emsp;&#x25aa; networkAddress <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-networkComesBefore"></a>
> ### Function [`networkComesBefore`](#api-networkComesBefore)
> <em>NetworkComesBefore returns a bool with regards to numerical network order.</em>  
> <em>Please note that IPv4 comes before IPv6 and larger networks come before smaller ones.</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L170-L183)  
> > **networkComesBefore( )** <sup>&rArr; <code>null | true | false</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L170-L183)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25aa; otherNetwork <sup><code>string</code></sup> <em>- A network like 192.168.1.0/24</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-networkContainsSubnet"></a>
> ### Function [`networkContainsSubnet`](#api-networkContainsSubnet)
> <em>NetworkContainsSubnet validates that the network is a valid supernet</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L198-L204)  
> > **networkContainsSubnet( )** <sup>&rArr; <code>null | true | false</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L198-L204)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/16</em>  
> > &emsp;&#x25aa; subnet <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-networksIntersect"></a>
> ### Function [`networksIntersect`](#api-networksIntersect)
> <em>NetworksIntersect returns a bool showing if the networks overlap</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L219-L225)  
> > **networksIntersect( )** <sup>&rArr; <code>null | true | false</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L219-L225)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/23</em>  
> > &emsp;&#x25aa; otherNetwork <sup><code>string</code></sup> <em>- A network like 192.168.1.0/24</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-nextNetwork"></a>
> ### Function [`nextNetwork`](#api-nextNetwork)
> <em>NextNetwork returns the next network of the same size.</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L239-L246)  
> > **nextNetwork( )** <sup>&rArr; <code>null | string</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L239-L246)  
> > &emsp;&#x25aa; network <sup><code>string</code></sup> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; strict<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
>
> <a name="api-rangeOfNetworks"></a>
> ### Function [`rangeOfNetworks`](#api-rangeOfNetworks)
> <em>RangeOfNetworks returns an array of networks given a range of addresses</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L260-L287)  
> > **rangeOfNetworks( )** <sup>&rArr; <code>null | string[]</code></sup> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L260-L287)  
> > &emsp;&#x25aa; startAddress <sup><code>string</code></sup> <em>- An address like 192.168.1.2</em>  
> > &emsp;&#x25aa; stopAddress <sup><code>string</code></sup> <em>- An address like 192.168.1.5</em>  
> > &emsp;&#x25ab; throwErrors<sub>?</sub> <sup><code>undefined | true | false</code></sup> <em>- Stop the library from failing silently</em>  
