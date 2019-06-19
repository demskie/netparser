/* eslint-disable @typescript-eslint/no-use-before-define */

/* 
  https://tools.ietf.org/html/rfc3986
    ffff:fc00::1:1234/64
    [fde4:3510:269e:ffbd::/64]
  https://tools.ietf.org/html/rfc4291
  https://tools.ietf.org/html/rfc5952#section-4
    [2001:db8::1]:80
    2001:db8::1:80
    2001:db8::1.80
    2001:db8::1 port 80
    2001:db8::1p80
    2001:db8::1#80
*/

function parse(s: string) {
  s = s.trim().toLowerCase();
  const parts = s.split("/");
  if (parts.length > 2) return null;
  if (s.search(":") >= 0) {
    let cidr = 128;
    if (parts.length === 2) {
      cidr = parseInt(parts[1], 10);
      if (Number.isNaN(cidr) || cidr < 0 || cidr > 128) return null;
    }
    s = cleanIPv6(s);
  }
  // let cidr = 32;
  // TODO: finish
}

function cleanIPv6(old: string) {
  let s = "";
  let periodCount = 0;
  for (let i = 0; i < old.length; i++) {
    if (i === 0 && old[0] === "[") continue;
    switch (old[i]) {
      case ".":
        if (periodCount > 2) return "";
        s += ".";
        periodCount++;
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "a":
      case "b":
      case "c":
      case "d":
      case "e":
      case "f":
        s += old[i];
        break;
      default:
        return s;
    }
  }
  if (periodCount !== 0 && periodCount !== 3) return "";
  return s;
}
