### API
> <a name="api-baseAddress"></a>
> ### Function [`baseAddress`](#api-baseAddress)
> <em>Return the base address for a given subnet address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L70-L85)  
> > **baseAddress( )** &rArr; <code>null | string</code> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L70-L85)  
> > &emsp;&#x25aa; networkAddress <code>string</code> <em>- A network address like 192.168.0.4/24</em>  
> > &emsp;&#x25ab; throwErrors <code>undefined | true | false</code> <em>- Stop the library from failing silently</em>  
>
> <a name="api-ip"></a>
> ### Function [`ip`](#api-ip)
> <em>Parse an IP address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L16-L29)  
> > **ip( )** &rArr; <code>null | string</code> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L16-L29)  
> > &emsp;&#x25aa; address <code>string</code> <em>- Either an address like 192.168.0.0 or subnet 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors <code>undefined | true | false</code> <em>- Stop the library from failing silently</em>  
>
> <a name="api-network"></a>
> ### Function [`network`](#api-network)
> <em>Parse a network address</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L42-L57)  
> > **network( )** &rArr; <code>null | string</code> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L42-L57)  
> > &emsp;&#x25aa; networkAddress <code>string</code> <em>- A network like 192.168.0.0/24</em>  
> > &emsp;&#x25ab; throwErrors <code>undefined | true | false</code> <em>- Stop the library from failing silently</em>  
>
> <a name="api-rangeOfNetworks"></a>
> ### Function [`rangeOfNetworks`](#api-rangeOfNetworks)
> <em>Returns an array of networks given a range of addresses</em>  
> Source code: [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L99-L147)  
> > **rangeOfNetworks( )** &rArr; <code>null | string[]</code> [`<>`](http://github.com/demskie/netparser/blob/master/src\index.ts#L99-L147)  
> > &emsp;&#x25aa; startAddress <code>string</code>  
> > &emsp;&#x25aa; stopAddress <code>string</code>  
> > &emsp;&#x25ab; throwErrors <code>undefined | true | false</code> <em>- Stop the library from failing silently</em>  
