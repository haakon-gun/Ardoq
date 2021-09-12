import React, { useState } from "react";
import { Input, Box, Button } from "@chakra-ui/react";
import { isNaN } from "lodash";

const HighestProduct = () => {
  const [value, setValue] = useState("");
  const [hp, setHp] = useState("");

  /*#######################################
  
  1: Create a function that, given a list of integers, returns the highest product between three of those numbers. 
  For example, given the list [1, 10, 2, 6, 5, 3] the highest product would be 10 * 6 * 5 = 300

  I made some extra gui for this task. 
  The function highestProductCalculator is the one that is relevant for the task.

*/
  const highestProductCalculator = (n: number[]) => {
    if (n.length < 3) return null;
    n.sort((a, b) => b - a);
    if (
      n.every((k) => k <= 0) ||
      n.every((k) => k >= 0) ||
      n.filter((k) => k < 0).length <= 1
    ) {
      return n[0] * n[1] * n[2];
    }
    let negativeNumbers = n.filter((k) => k < 0).sort((a, b) => a - b);

    let biggestPositive = n[0] * n[1] * n[2];
    let biggestNegative = n[0] * negativeNumbers[0] * negativeNumbers[1];
    if (biggestPositive || biggestNegative)
      return biggestPositive > biggestNegative
        ? biggestPositive
        : biggestNegative;

    console.log("neiii");
    return n[0] * n[1] * n[2];
  };

  //###################################

  const onClickHandler = () => {
    if (value == "") {
      setHp("No input");
      return;
    }
    let list = stringToNumbers(value);
    if (list != null) {
      let n = highestProductCalculator(list);
      if (n != null) setHp(`Highest product is: ${n}`);
      else setHp("Wrong input format");
      return;
    }
    setHp("Wrong input format");
  };

  const stringToNumbers = (text: String) => {
    let strList = text.split(",");
    if (strList.every((c) => !isNaN(parseFloat(c)) && isFinite(c as any))) {
      return strList.map(Number);
    }
    return null;
  };

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const v = ev.target.value;
    setValue(v);
  };

  return (
    <div>
      <Box>
        <p>Enter a set of numbers seperated by comma</p>
        <Button
          size="sm"
          color="Black"
          bg="cyan.700"
          justify="center"
          _hover={{ backgroundColor: "cyan.600" }}
          onClick={() => {
            onClickHandler();
          }}
        >
          Submit
        </Button>
        <Input
          aria-label="Enter numbers"
          value={value}
          onChange={onChange}
          variant="outline"
          bg="white"
        />
        <p>{hp}</p>
      </Box>
    </div>
  );
};

export default HighestProduct;
