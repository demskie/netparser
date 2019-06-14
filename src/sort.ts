import * as shared from "./shared";

export function radixSortNetworks(networks: shared.Network[], start: number, stop: number, byteIndex: number) {
  const runningPrefixSum = new Array(256) as number[];
  const offsetPrefixSum = new Array(256) as number[];
  const counts = runningPrefixSum;
  for (let i = 0; i < counts.length; i++) {
    counts[i] = 0;
  }

  // count each occurance of byte value
  for (let i = start; i < stop; i++) {
    if (byteIndex === -1) {
      counts[networks[i].bytes.length]++;
    } else if (byteIndex < 16) {
      if (byteIndex < networks[i].bytes.length) {
        networks[i].bytes[byteIndex] = Math.min(Math.max(0, networks[i].bytes[byteIndex]), 255);
      }
      counts[networks[i].bytes[byteIndex]]++;
    } else {
      networks[i].cidr = Math.min(Math.max(0, networks[i].cidr), 8 * networks[i].bytes.length);
      counts[networks[i].cidr]++;
    }
  }
  let lastCount = counts[counts.length - 1];

  // initialize runningPrefixSum
  let total = 0;
  let oldCount = 0;
  for (let i = 0; i < 256; i++) {
    oldCount = counts[i];
    runningPrefixSum[i] = total;
    total += oldCount;
  }

  // initialize offsetPrefixSum (american flag sort)
  for (let i = 0; i < 256; i++) {
    if (i < 255) {
      offsetPrefixSum[i] = runningPrefixSum[i + 1];
    } else {
      offsetPrefixSum[i] = runningPrefixSum[i] + lastCount;
    }
  }

  // in place swap and sort by value
  let redIndex = start;
  let redValue = 0;
  while (redIndex < stop) {
    if (byteIndex === -1) {
      redValue = networks[redIndex].bytes.length;
    } else if (byteIndex < 16) {
      if (byteIndex < networks[redIndex].bytes.length) {
        redValue = networks[redIndex].bytes[byteIndex];
      } else {
        redValue = 0;
      }
    } else {
      redValue = networks[redIndex].cidr;
    }
    let blueIndex = start + runningPrefixSum[redValue];
    if (runningPrefixSum[redValue] < offsetPrefixSum[redValue]) {
      runningPrefixSum[redValue]++;
      if (redIndex === blueIndex) {
        redIndex++;
      } else {
        let oldRedNetwork = networks[redIndex];
        networks[redIndex] = networks[blueIndex];
        networks[blueIndex] = oldRedNetwork;
      }
    } else {
      redIndex++;
    }
  }

  // recurse and sort lower bits
  if (byteIndex < 16) {
    let lastPrefixSum = 0;
    for (var i = 0; i < runningPrefixSum.length; i++) {
      if (runningPrefixSum[i] !== lastPrefixSum) {
        radixSortNetworks(networks, start + lastPrefixSum, start + runningPrefixSum[i], byteIndex + 1);
      }
      lastPrefixSum = runningPrefixSum[i];
    }
  }
}

export function binarySearchForInsertionIndex(network: shared.Network, sortedNetworks: shared.Network[]) {
  let left = 0;
  let right = sortedNetworks.length - 1;
  while (left < right) {
    let middle = Math.floor((left + right) / 2);
    let netCmp = shared.compareNetworks(sortedNetworks[middle], network);
    switch (netCmp) {
      case shared.Pos.equals:
        return middle;
      case shared.Pos.before:
        left = middle + 1;
        break;
      case shared.Pos.after:
        right = middle - 1;
        break;
    }
  }
  let netCmp = shared.compareNetworks(sortedNetworks[left], network);
  if (netCmp === shared.Pos.before) return left + 1;
  return left;
}
