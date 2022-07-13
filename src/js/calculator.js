const operators = {
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: 'X',
  DIVIDE: '/',
  AC: 'AC',
  CALCULATE: '=',
};
const operatorPrecedences = {
  [operators.MULTIPLY]: 2,
  [operators.DIVIDE]: 2,
  [operators.ADD]: 1,
  [operators.SUBTRACT]: 1,
};
const operatorFunctions = {
  [operators.MULTIPLY]: (a, b) => b * a,
  [operators.DIVIDE]: (a, b) => b / a,
  [operators.ADD]: (a, b) => b + a,
  [operators.SUBTRACT]: (a, b) => b - a,
};
export const errorMessages = Object.freeze({
  SYNTAX_ERROR: '숫자를 먼저 입력한 후 연산자를 입력해주세요!',
  MAX_LENGTH_ERROR: '숫자는 세 자리까지만 입력 가능합니다!',
  NOT_A_NUMBER_ERROR: '숫자만 연산이 가능합니다!',
});
const MAX_NUMBER_LENGTH = 3;

class Calculator {
  #buffer;

  #infix;

  #result;

  get result() {
    return this.#result;
  }

  constructor() {
    this.clearAll();
  }

  #calculate() {
    const postfix = Calculator.convertToPostfix(this.#infix);
    let result = Calculator.calculatePostfix(postfix);

    if (Number.isFinite(result)) result = parseInt(result, 10);

    this.#result = result;
    this.#buffer = result.toString();
    this.#infix = [];
  }

  #pushBuffer() {
    if (this.#buffer === '') return;

    this.#infix.push(this.#buffer);
    this.#buffer = '';
  }

  #validate(value) {
    if (!Number.isInteger(this.#result)) {
      throw new Error(errorMessages.NOT_A_NUMBER_ERROR);
    }

    if (Number.isInteger(Number(value))) {
      if (this.#buffer.length >= MAX_NUMBER_LENGTH)
        throw new Error(errorMessages.MAX_LENGTH_ERROR);
    } else if (this.#buffer === '') {
      throw new Error(errorMessages.SYNTAX_ERROR);
    }
  }

  clearAll() {
    this.#buffer = '';
    this.#infix = [];
    this.#result = 0;
  }

  push(value) {
    if (value === operators.AC) {
      this.clearAll();
      return;
    }

    if (value === operators.CALCULATE) {
      this.#pushBuffer();
      this.#calculate();
      return;
    }

    this.#validate(value);

    if (Number.isInteger(Number(value))) {
      this.#buffer = Calculator.removeLeadingZero(this.#buffer + value);
    } else {
      this.#pushBuffer();
      this.#infix.push(value);
    }
  }

  toString() {
    return this.#infix.concat(this.#buffer).join('');
  }

  static convertToPostfix(infix) {
    const postfix = [];
    const stack = [];

    const isLowerOrEqualOperatorPrecedence = (operatorA, operatorB) =>
      operatorPrecedences[operatorA] <= operatorPrecedences[operatorB];

    infix.forEach((value) => {
      if (Number.isInteger(Number(value))) {
        postfix.push(value);
        return;
      }

      while (
        stack.length > 0 &&
        isLowerOrEqualOperatorPrecedence(value, stack.at(-1))
      ) {
        postfix.push(stack.pop());
      }

      stack.push(value);
    });

    return postfix.concat(stack.reverse());
  }

  static removeLeadingZero(numberString) {
    return Number(numberString).toString();
  }

  static calculatePostfix(postfix) {
    const stack = [];

    postfix.forEach((value) => {
      if (Number.isInteger(Number(value))) {
        stack.push(Number(value));
        return;
      }

      const fn = operatorFunctions[value];

      stack.push(fn(stack.pop(), stack.pop()));
    });

    return stack[0] ?? 0;
  }
}

export default Calculator;
