import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// Option for the user to select the semester when writing a review
export default function ReviewDropdownSemester({ options, value, onChange }) {
  return (
    <>
      <FormControl sx={{ width: '192px' }}>
        <InputLabel>Semesters</InputLabel>
        <Select
          value={value}
          label='SemestersOptions'
          onChange={(event) => {
            onChange(event.target.value);
          }}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option.year + ' ' + option.season}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
