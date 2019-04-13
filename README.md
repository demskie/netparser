

## Index

### Functions

* [ip](#ip)
* [subnetZero](#subnetzero)

---

## Functions

<a id="ip"></a>

###  ip

▸ **ip**(s: *`string`*, throwErrors?: *`undefined` \| `false` \| `true`*): `null` \| `string`

*Defined in [index.ts:15](https://github.com/demskie/netparser/blob/222a0b7/src/index.ts#L15)*

Parse an IP address

*__remarks__*: Verify that an external source provided a valid IP address

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| s | `string` |  An address (192.168.0.0) or subnet (192.168.0.0/24) |
| `Optional` throwErrors | `undefined` \| `false` \| `true` |  Stop the library from failing silently |

**Returns:** `null` \| `string`
The parsed IP address or null in case of error

___
<a id="subnetzero"></a>

###  subnetZero

▸ **subnetZero**(s: *`string`*, throwErrors?: *`undefined` \| `false` \| `true`*): `null` \| `string`

*Defined in [index.ts:47](https://github.com/demskie/netparser/blob/222a0b7/src/index.ts#L47)*

Given a random subnet address, what is it's network address

*__example__*: netparser.subnetZero("192.168.0.4/24") // returns 192.168.0.0

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| s | `string` |  The subnet (192.168.0.0/24) |
| `Optional` throwErrors | `undefined` \| `false` \| `true` |  Stop the library from failing silently |

**Returns:** `null` \| `string`
The first address in a subnet or null in case of error

___

