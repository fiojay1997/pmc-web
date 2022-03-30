import React, { useEffect, useState } from 'react';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import Color from 'color';

export default function TimeBlock({
  text,
  variant = 'outlined',
  color = 'gray',
  darken = false,
  showDetails = false,
  details,
  data,
  sx = {},
  ...props
}) {
  const theme = useTheme();

  const [palette, setPalette] = useState({ backgroundColor: '', borderColor: '', color: '' });

  useEffect(() => {
    const mainColor = Color(
      color === 'gray' ? theme.palette.grey[500] : theme.palette[color]?.main || color
    );
    let shades = showDetails
      ? [mainColor.string(), mainColor.desaturate(0.25).darken(0.25).string()]
      : [mainColor.lighten(0.25).string(), mainColor.string()];

    const outlinedBackgroundColors = [
      mainColor.lightness(97.2).string(),
      mainColor.lightness(93.8).string(),
    ];

    setPalette({
      backgroundColor:
        variant === 'outlined' ? outlinedBackgroundColors[+darken] : shades[+darken],
      borderColor: shades[+darken],
      color: variant === 'outlined' ? shades[+darken] : '',
    });
  }, [theme, variant, color, darken]);

  const buttonStyles = {
    ...sx,
    width: '100%',
    minWidth: 0,
    height: '100%',
    boxShadow: (showDetails ? 2 : 1) * (darken ? 3 : 1),
    borderWidth: '2px !important',
    borderRadius: showDetails ? '4px' : '0px',
    wordSpacing: !showDetails && '100vw',
    alignItems: 'flex-start',
    overflow: 'hidden',
    textTransform: 'none',
    padding: '6px 0',
    '&, &:hover, &:focus': { ...palette },
    '*': { pointerEvents: 'none' },
  };

  const titleFontSize = getDynamicFontSize(showDetails ? 16 : 14);
  const descriptionFontSize = getDynamicFontSize(14);

  return (
    <Button text={text} variant={variant} color='primary' sx={buttonStyles} {...props}>
      <Stack>
        <Typography variant='subtitle2' lineHeight={1.17} fontSize={titleFontSize}>
          {text}
        </Typography>
        {showDetails && (
          <Typography variant='body2' lineHeight={1.5} fontSize={descriptionFontSize}>
            {details}
          </Typography>
        )}
      </Stack>
    </Button>
  );
}

/**
 * Returns the CSS style for font size that automatically scales with the screen size, with
 * maximum value being `maxFontSize` pixels.
 */
const getDynamicFontSize = (maxFontSize) =>
  `min(${maxFontSize}px, ${maxFontSize} / 1280 * 100vw, ${maxFontSize} / 960 * 100vh)`;
