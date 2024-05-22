import Button from "./components/Button";
import Container from "./components/Container";
import Display from "./components/Display";
import Row from "./components/Row";

import { useReducer } from "react";

type State = {
  displayValue: number;
  calculatedValue: number;
};

type StateAction =
  | {
      type: "input";
      payload: number;
    }
  | {
      type: "subtract" | "add" | "clear";
      payload?: never;
    };

function App() {
  const [state, dispatch] = useReducer(
    (previousState: State, action: StateAction) => {
      switch (action.type) {
        case "add": {
          const newValue =
            previousState.displayValue + previousState.calculatedValue;
          return {
            ...previousState,
            displayValue: newValue,
            calculatedValue: newValue,
          };
        }
        case "clear": {
          return {
            displayValue: 0,
            calculatedValue: 0,
          };
        }
      }
    },
    {
      displayValue: 15,
      calculatedValue: 10,
    }
  );

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
          <Button>÷</Button>
        </Row>
        <Row>
          <Button
            variant="tertiary"
            onClick={() => dispatch({ type: "input", payload: 7 })}
          >
            7
          </Button>
          <Button variant="tertiary">8</Button>
          <Button variant="tertiary">9</Button>
          <Button>×</Button>
        </Row>
        <Row>
          <Button variant="tertiary">4</Button>
          <Button variant="tertiary">5</Button>
          <Button variant="tertiary">6</Button>
          <Button>-</Button>
        </Row>
        <Row>
          <Button variant="tertiary">1</Button>
          <Button variant="tertiary">2</Button>
          <Button variant="tertiary">3</Button>
          <Button onClick={() => dispatch({ type: "add" })}>+</Button>
        </Row>
        <Row>
          <Button variant="tertiary" span={1}>
            0
          </Button>
          <Button variant="tertiary">,</Button>
          <Button>=</Button>
        </Row>
      </Container>
    </div>
  );
}

export default App;
