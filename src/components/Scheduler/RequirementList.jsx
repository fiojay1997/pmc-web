import React, { useContext } from 'react';
import { Divider, Link, Stack, Typography } from '@mui/material';
import ClickableIndicator from 'components/CourseCardGrid/CourseCard/ClickableIndicator';
import { PreventableNavigationContext } from 'components/PreventableNavigation/ContainerWithPreventableNavigation';
import HistoryBreakdownChart from 'components/ProfilePage/ProfileHistory/HistoryBreakdownChart';
import PreventableLink from 'components/PreventableNavigation/PreventableLink';

/** The requirement list resides in the bottom part of the scheduler. */
export default function RequirementList({ requirements = [] }) {
  const { navigateIfAllowed } = useContext(PreventableNavigationContext);

  if (!requirements?.length) return null;

  return (
    <Stack spacing='12px'>
      <Divider />
      <ClickableIndicator onClick={() => navigateIfAllowed('/profile/roadmap')}>
        <Typography variant='subtitle2'>Requirements</Typography>
      </ClickableIndicator>
      <HistoryBreakdownChart
        historyBreakdown={requirements}
        style={{ height: 28 * requirements.length + 'px', marginTop: 0 }}
        hideTransitions
      />
      <Link
        component={PreventableLink}
        to='/profile/roadmap'
        variant='caption'
        color='text.secondary'
        underline='hover'
        textAlign='center'
      >
        View requirement details
      </Link>
    </Stack>
  );
}
