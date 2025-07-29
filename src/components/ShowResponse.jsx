// Importing necessary React hooks and custom functions
import React, { useState, useEffect } from 'react';
import { headChecks, headReplace } from './usefulFunctions'; // Custom functions to check and modify heading strings

// Functional component to display individual response items
const ShowResponse = ({ itm, ind, lengthCheck }) => {
  // State to determine if the current line is a heading
  const [heading, setHeading] = useState(false);

  // State to store the final text (after any replacements)
  const [replace, setReplace] = useState('');

  // Runs whenever 'itm' changes
  useEffect(() => {
    let str = '';

    // If 'itm' is a string, use it directly
    if (typeof itm === 'string') {
      str = itm;
    }
    // If 'itm' is an object with a 'content' key, use the value of that key
    else if (typeof itm === 'object' && itm !== null && 'content' in itm) {
      str = itm.content;
    }
    // If itm is not valid, show a warning and set a default error message
    else {
      console.warn('Invalid itm:', itm);
      setReplace('[Invalid data]');
      return; // Stop further execution
    }

    // Check if the string should be treated as a heading
    setHeading(headChecks(str));

    // If it's a heading, replace it using 'headReplace', else just keep the string as is
    setReplace(headChecks(str) ? headReplace(str) : str);
  }, [itm]);

  // Check if the current line index is within the top 3 lines to apply special top-line styling
  const isTopLine = ind < 3;

  // If it's one of the first few lines, apply slightly larger and bolder font
  const topLineClass = isTopLine ? 'text-lg font-semibold' : '';

  // If it's a detected heading (via `headChecks`), apply bold and larger font
  const headingClass = heading ? 'text-lg font-bold' : '';

  // If it's not a heading and not a top line, apply normal styling with some left padding
  const normalClass = !heading && !isTopLine ? 'text-sm font-medium pl-4' : '';

  return (
    // Return a <span> element with dynamic styling based on the type of line
    <span className={`text-left block mb-2 ${headingClass} ${topLineClass} ${normalClass}`}>
      {/* Display the replaced text or a fallback if empty */}
      {replace || '[Empty]'}
    </span>
  );
};

// Exporting the component for use in other files
export default ShowResponse;
