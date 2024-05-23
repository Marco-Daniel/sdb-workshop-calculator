// import hooks
import { useCallback, useReducer } from "react";

// import components
import Button from "./components/Button";
import Container from "./components/Container";
import Display from "./components/Display";
import Row from "./components/Row";

// import types
import type { Reducer } from "react";

// Define the possible calculator actions
type CalcAction = "subtract" | "add" | "multiply" | "divide";

// Define the shape of the state
type State = {
  // The current number displayed
  displayValue: number;

  // The stored value used in calculations
  calculatedValue: number;

  // The last arithmetic operation performed
  lastOperation: string;

  // Flag indicating if a decimal point should be added
  shouldAddComma: boolean;

  // Flag indicating if the display should be reset
  shouldResetDisplay: boolean;
};

// Define the actions that can be dispatched to the reducer
type StateAction =
  | {
      type: "input";
      payload: number; // 'input' actions must include a payload with a number
    }
  | {
      type: CalcAction | "equals" | "comma" | "clear";
      payload?: never; // Ensures type safety, these actions should not have a payload
    };

/*
  Explanation:
  The 'StateAction' type is a union type, which means it can be one of several different shapes.
  It can either be an object with a 'type' property of "input" and a 'payload' property of type number,
  or it can be an object with a 'type' property that is one of 'CalcAction', "equals", "comma", or "clear",
  and it must not have a 'payload' property.
  
  The 'payload?: never' pattern is used to enforce type safety. The 'payload?:' part means the 'payload'
  property is optional, but if it is present, it must be of type 'never'. 'never' is a special TypeScript type
  that indicates a value that should never occur. This effectively means that when the action is one of
  'CalcAction', "equals", "comma", or "clear", it should not include a 'payload' property at all.
  
  This pattern helps catch errors at compile time, ensuring that you don't accidentally include a 'payload'
  with these specific action types. For example, if you tried to dispatch { type: "clear", payload: 123 },
  TypeScript would raise an error, because the 'clear' action should not have a 'payload' property.
*/

const initialState: State = {
  displayValue: 0,
  calculatedValue: 0,
  lastOperation: "",
  shouldAddComma: false,
  shouldResetDisplay: false,
};

const calcActionType = ["subtract", "add", "multiply", "divide"] as const;

// Type guard function to check if a string is a valid calculator action
const isCalcAction = (input: string): input is CalcAction =>
  (calcActionType as unknown as string[]).includes(input);

const calcOperations: Record<
  (typeof calcActionType)[number],
  (a: number, b: number) => number
> = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
};

// Reducer function to manage state transitions based on dispatched actions
const reducer: Reducer<State, StateAction> = (previousState, action) => {
  // Prepare an updated state template with common properties
  const updatedState = {
    ...previousState,
    lastOperation: action.type,
    shouldAddComma: false,
    shouldResetDisplay: false,
  };

  switch (action.type) {
    case "comma": {
      return {
        ...updatedState,
        lastOperation: previousState.lastOperation,
        shouldAddComma: true,
      };
    }
    case "input": {
      const newValue = previousState.shouldResetDisplay
        ? action.payload
        : parseFloat(
            `${previousState.displayValue}${
              previousState.shouldAddComma ? "." : ""
            }${action.payload}`
          );

      return {
        ...updatedState,
        lastOperation: previousState.lastOperation,
        displayValue: newValue,
      };
    }
    case "divide":
    case "multiply":
    case "subtract":
    case "add": {
      if (previousState.lastOperation === "equals") {
        return { ...updatedState, shouldResetDisplay: true };
      }

      if (!previousState.calculatedValue) {
        return {
          ...updatedState,
          calculatedValue: previousState.displayValue,
          shouldResetDisplay: true,
        };
      }

      const newValue = calcOperations[action.type](
        previousState.calculatedValue,
        previousState.displayValue
      );
      return {
        ...updatedState,
        displayValue: newValue,
        calculatedValue: newValue,
        shouldResetDisplay: true,
      };
    }
    case "equals": {
      const newValue = isCalcAction(previousState.lastOperation)
        ? calcOperations[previousState.lastOperation](
            previousState.calculatedValue,
            previousState.displayValue
          )
        : previousState.calculatedValue;

      return {
        ...updatedState,
        displayValue: newValue,
        calculatedValue: newValue,
        shouldResetDisplay: true,
      };
    }
    case "clear": {
      // Reset to the initial state
      return { ...initialState };
    }
    default:
      return updatedState;
  }
};

function App() {
  // Initialize state management using the reducer and initial state
  const [state, dispatch] = useReducer(reducer, initialState);

  // Memoize dispatching of input actions to prevent unnecessary re-renders
  const dispatchInput = useCallback(
    (payload: number) => () => dispatch({ type: "input", payload }),
    []
  );

  // Render the calculator UI
  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gradient-to-r from-neutral-700 to-neutral-800">
      <Container>
        <Display value={state.displayValue} />
        <Row>
          <Button
            variant="secondary"
            onClick={() => dispatch({ type: "clear" })}
          >
            A/C
          </Button>
          <Button variant="secondary"></Button>
          <Button variant="secondary"></Button>
          <Button onClick={() => dispatch({ type: "divide" })}>÷</Button>
        </Row>
        <Row>
          <Button variant="tertiary" onClick={dispatchInput(7)}>
            7
          </Button>
          <Button variant="tertiary" onClick={dispatchInput(8)}>
            8
          </Button>
          <Button variant="tertiary" onClick={dispatchInput(9)}>
            9
          </Button>
          <Button onClick={() => dispatch({ type: "multiply" })}>×</Button>
        </Row>
        <Row>
          <Button variant="tertiary" onClick={dispatchInput(4)}>
            4
          </Button>
          <Button variant="tertiary" onClick={dispatchInput(5)}>
            5
          </Button>
          <Button variant="tertiary" onClick={dispatchInput(6)}>
            6
          </Button>
          <Button onClick={() => dispatch({ type: "subtract" })}>-</Button>
        </Row>
        <Row>
          <Button variant="tertiary" onClick={dispatchInput(1)}>
            1
          </Button>
          <Button variant="tertiary" onClick={dispatchInput(2)}>
            2
          </Button>
          <Button variant="tertiary" onClick={dispatchInput(3)}>
            3
          </Button>
          <Button onClick={() => dispatch({ type: "add" })}>+</Button>
        </Row>
        <Row>
          <Button variant="tertiary" span={1} onClick={dispatchInput(0)}>
            0
          </Button>
          <Button
            variant="tertiary"
            onClick={() => dispatch({ type: "comma" })}
          >
            ,
          </Button>
          <Button onClick={() => dispatch({ type: "equals" })}>=</Button>
        </Row>
      </Container>
    </div>
  );
}

export default App;
