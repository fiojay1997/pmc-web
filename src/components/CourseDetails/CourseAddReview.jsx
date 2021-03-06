import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
import { CourseContext } from '../../pages/CoursePage';
import { UserContext } from '../../App';
import CourseReviewsAccordian from 'components/CourseReviews/CourseReviewsAccordian';

/**
 * Check if the user has written a review for the given course
 *
 * @param user - the user
 * @param reviews the reviews for the given course
 */
function checkUserWroteReview(user, reviews) {
  if (user == null) {
    return false;
  }
  let userID = user.userID;
  for (let i = 0; i < reviews.length; i++) {
    if (reviews[i].userID === userID) {
      return true;
    }
  }
  return false;
}

/**
 * Notification for the user writing a review
 *
 * @param userWroteReview - whether the user has written the review
 * @param reviews the reviews for the given course
 */
function userReviewNotification(userWroteReview, user) {
  if (userWroteReview) {
    return 'You already wrote review for this course!';
  } else {
    if (user == null) {
      return 'Login or register to write a review';
    } else {
      return 'Share your thoughts with other students';
    }
  }
}

/**
 * Adding a review to the course
 *
 */
export default function CourseAddReview() {
  const { user } = useContext(UserContext);
  const { reviews } = useContext(CourseContext);
  let userWroteReview = checkUserWroteReview(user, reviews);
  let disabled = user == null || userWroteReview;
  return (
    <Grid item>
      <MuiTypography variant='h5' gutterBottom>
        Review this course
      </MuiTypography>
      <MuiTypography variant='subtitle1' gutterBottom>
        {userReviewNotification(userWroteReview, user)}
      </MuiTypography>
      {disabled ? <></> : <CourseReviewsAccordian />}
    </Grid>
  );
}
