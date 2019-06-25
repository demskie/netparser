export const MixingIPv4AndIPv6 = new Error("mixing IPv4 and IPv6 is invalid");
export const IPv6DoesNotHaveBroadcast = new Error("IPv6 does not have broadcast addresses");

export const GenericRemoveCIDR = new Error("more than one '/' was detected");
export const GenericGetCIDR = new Error("unable to get CIDR from subnet string");
export const GenericOffsetAddressWithCIDR = new Error("unable to offset address");
export const OverflowedAddressSpace = new Error("address space overflow detected");
export const NotValidBaseNetworkAddress = new Error("not a valid base network address");

export const AddrInvalidInteger = new Error("'addr' has at least one invalid integer");
export const AddrNotFourElements = new Error("'addr' was not four elements long");
export const BytesNotFourElements = new Error("'bytes' was not at least four elements long");

export const GenericNetworkParse = new Error("unable to parse string");
export const GenericBytesToAddr = new Error("unable to convert bytes to string");
export const GenericFindLongestZeroHextetChain = new Error("unable to findLongestZeroHextetChain");

export const InvalidSubnet = new Error("invalid subnet");
export const NotValidCIDR = new Error("'cidr' was not a valid integer");
