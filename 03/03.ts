import { FileReader } from "../utils";

type Interval = [number, number];

const instructions = FileReader.readAsSingleString("input.txt");

function evalMul(mulStr: string): number {
  const numberPair = mulStr.replace("mul(", "").replace(")", "").split(",");
  return Number(numberPair[0]) * Number(numberPair[1]);
}

/**
    Finds all valid mul operations and multiplies them
*/
function mutliplyValidMulSequences(instructions: string): number {
  const mulRegex: RegExp = /mul\(\d+,\d+\)/g;
  const matches: RegExpMatchArray | null = instructions.match(mulRegex);
  let sum: number = 0;

  if (matches) {
    for (const match of matches) {
      sum += evalMul(match);
    }
  }
  return sum;
}

/**
    Returns all intervals where do is active
*/
const getDoIntervals = (
  doIndices: number[],
  dontIndices: number[],
  instructionsLen: number
): Interval[] => {
  const activeIntervals: Interval[] = [];
  let doPointer = 0;
  let dontPointer = 0;

  while (doPointer < doIndices.length) {
    const doStart = doIndices[doPointer];

    // find first dont that is bigger than current do
    while (
      dontPointer < dontIndices.length &&
      dontIndices[dontPointer] <= doStart
    ) {
      dontPointer++;
      if (dontPointer === dontIndices.length) {
        activeIntervals.push([doStart, instructionsLen]);
        // if no more donts are present we have found the last interval and can break
        break;
      }
    }

    // If a don't is found after a do create an interval between those two
    activeIntervals.push([doStart, dontIndices[dontPointer]]);

    // Move to the next do index (bigger than last used dontPointer)
    while (
      doIndices[doPointer] <= activeIntervals[activeIntervals.length - 1][1] &&
      doPointer < doIndices.length
    ) {
      doPointer++;
    }
  }

  return activeIntervals;
};

/**
    Finds all valid mul operations considering dos and donts and mutliplies them
*/
function mutliplyValidEnabledMulSequences(instructions: string) {
  const doRegex: RegExp = /do\(\)/g;
  const dontRegex: RegExp = /don't\(\)/g;
  let result: RegExpExecArray | null;
  let doIndices = [0];
  let dontIndices = [];

  while ((result = doRegex.exec(instructions)) !== null) {
    doIndices.push(result.index);
  }
  while ((result = dontRegex.exec(instructions)) !== null) {
    dontIndices.push(result.index);
  }

  let sum: number = 0;
  for (const interval of getDoIntervals(
    doIndices,
    dontIndices,
    instructions.length
  ))
    sum += mutliplyValidMulSequences(
      instructions.slice(interval[0], interval[1])
    );

  return sum;
}

console.log(`Part 1 solution: ${mutliplyValidMulSequences(instructions)}`);
console.log(
  `Part 2 solution: ${mutliplyValidEnabledMulSequences(instructions)}`
);
