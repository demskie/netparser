### API
Docs generated using [`docts`](https://github.com/charto/docts)
>
> <a name="api-baseAddress"></a>
> ### Function [`baseAddress`](#api-baseAddress)
> <em>BaseAddress returns the base address for a given subnet address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L72-L87)  
> > **baseAddress( )** &rArr; <code>null | string</code> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L72-L87)  
> > &emsp;&#x25aa; networkAddress <code>string</code> <em>- A network address like 192.168.0.4/24</em>  
> > &emsp;&#x25ab; throwErrors <code>undefined | true | false</code> <em>- Stop the library from failing silently</em>  
>
> <a name="api-broadcastAddress"></a>
> ### Function [`broadcastAddress`](#api-broadcastAddress)
> <em>BroadcastAddress returns the broadcast address for an IPv4 address.</em>  
> <em>Please note that IPv6 does not have broadcast addresses.</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L265-L284)  
> > **broadcastAddress( )** &rArr; <code>null | string</code> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L265-L284)  
> > &emsp;&#x25aa; network <code>string</code> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors <code>undefined | true | false</code> <em>- Stop the library from failing silently</em>  
>
> <a name="api-ip"></a>
> ### Function [`ip`](#api-ip)
> <em>Parse an IP address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L18-L31)  
> > **ip( )** &rArr; <code>null | string</code> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L18-L31)  
> > &emsp;&#x25aa; address <code>string</code> <em>- Either an address like 192.168.0.0 or subnet 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors <code>undefined | true | false</code> <em>- Stop the library from failing silently</em>  
>
> <a name="api-network"></a>
> ### Function [`network`](#api-network)
> <em>Parse a network address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L44-L59)  
> > **network( )** &rArr; <code>null | string</code> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L44-L59)  
> > &emsp;&#x25aa; networkAddress <code>string</code> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors <code>undefined | true | false</code> <em>- Stop the library from failing silently</em>  
>
> <a name="api-networkComesBefore"></a>
> ### Function [`networkComesBefore`](#api-networkComesBefore)
> <em>NetworkComesBefore returns a bool with regards to numerical network order.</em>  
> <em>Please mote that IPv4 comes before IPv6 and larger networks come before smaller ones.</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L165-L211)  
> > **networkComesBefore( )** &rArr; <code>null | true | false</code> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L165-L211)  
> > &emsp;&#x25aa; network <code>string</code> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25aa; otherNetwork <code>string</code> <em>- A network like 192.168.1.0/24</em>  
> > &emsp;&#x25ab; strict <code>undefined | true | false</code> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors <code>undefined | true | false</code> <em>- Stop the library from failing silently</em>  
>
> <a name="api-nextNetwork"></a>
> ### Function [`nextNetwork`](#api-nextNetwork)
> <em>NextNetwork returns the next network of the same size.</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L225-L251)  
> > **nextNetwork( )** &rArr; <code>null | string</code> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L225-L251)  
> > &emsp;&#x25aa; network <code>string</code> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; strict <code>undefined | true | false</code> <em>- Do not automatically mask addresses to baseAddresses</em>  
> > &emsp;&#x25ab; throwErrors <code>undefined | true | false</code> <em>- Stop the library from failing silently</em>  
>
> <a name="api-rangeOfNetworks"></a>
> ### Function [`rangeOfNetworks`](#api-rangeOfNetworks)
> <em>RangeOfNetworks returns an array of networks given a range of addresses</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L101-L149)  
> > **rangeOfNetworks( )** &rArr; <code>null | string[]</code> [`<>`](http://github.com/demskie/netparser/blob/master/src/index.ts#L101-L149)  
> > &emsp;&#x25aa; startAddress <code>string</code>  
> > &emsp;&#x25aa; stopAddress <code>string</code>  
> > &emsp;&#x25ab; throwErrors <code>undefined | true | false</code> <em>- Stop the library from failing silently</em>  
