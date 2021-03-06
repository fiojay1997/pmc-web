import { React, useState, useEffect, useContext } from 'react';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { isNumeric } from '../../utils';
import { FilterContext } from 'pages/SearchPage';

export default function CreditButton({ optionSelected, setOptionSelected }) {
  const [value, setValue] = useState(['', '']);
  const { setMinCreditHour, setMaxCreditHour } = useContext(FilterContext);

  useEffect(() => {
    if (optionSelected.length) setValue(optionSelected);
  }, [optionSelected]);

  const handleMaxCredit = (event) => {
    let newVal = [];
    isNumeric(event.target.value) ? (newVal[1] = event.target.value) : (newVal[1] = '');
    newVal[0] = value[0];
    setValue(newVal);
    setOptionSelected(newVal);
    setMaxCreditHour(newVal);
  };

  const handleMinCredit = (event) => {
    let newVal = [];
    isNumeric(event.target.value) ? (newVal[0] = event.target.value) : (newVal[0] = '');
    newVal[1] = value[1];
    setValue(newVal);
    setOptionSelected(newVal);
    setMinCreditHour(newVal);
  };

  return (
    <>
      <MenuItem sx={{ maxWidth: 100 }}>
        <FormControl sx={{ width: '100%' }}>
          <OutlinedInput
            placeholder='min '
            value={value[0]}
            onChange={(event) => handleMinCredit(event)}
          />
        </FormControl>
      </MenuItem>
      <MenuItem sx={{ maxWidth: 100 }}>
        <FormControl sx={{ width: '100%' }}>
          <OutlinedInput
            placeholder='max'
            value={value[1]}
            onChange={(event) => handleMaxCredit(event)}
          />
        </FormControl>
      </MenuItem>
    </>
  );
}
