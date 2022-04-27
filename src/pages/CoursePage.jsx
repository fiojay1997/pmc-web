import React, {
  createContext,
  createElement,
  useCallback,
  useEffect,
  useState,
  useContext,
} from 'react';
import { useParams } from 'react-router-dom';
import { Forum, PieChart, ShoppingCart, Widgets } from '@mui/icons-material';
import { Box, Container } from '@mui/material';
import {
  fetchCourseByID,
  fetchReviewsByCourseID,
  fetchReviewTagsByCourseID,
  fetchProfessorByCourseID,
  fetchSemestersByCollegeID,
  fetchProfessorRanking,
  fetchCourseLoad,
  fetchRatingTrend,
  fetchCoursePopularity,
  fetchReviewDifficultyByCourseID,
} from '../api';
import CoursePageTop, { imageHeight } from '../components/CoursePage/CoursePageTop';
import CourseOverview from '../components/CoursePage/CourseOverview';
import CourseStats from '../components/CoursePage/CourseStats';
import CourseReviews from '../components/CoursePage/CourseReviews';
import CourseRegistration from '../components/CoursePage/CourseRegistration';
import ContainerWithLoadingIndication from '../components/Page/ContainerWithLoadingIndication';
import { UserContext } from '../App';

import Scrollbars from 'react-custom-scrollbars-2';

export default function CoursePage() {
  const urlParams = useParams();
  const [activeTabName, setActiveTabName] = useState('');
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [reviewTags, setReviewTags] = useState(null);
  const [professors, setProfessors] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [professorRanking, setProfessorRanking] = useState();
  const [courseLoad, setCourseLoad] = useState();
  const [courseTrend, setCourseTrend] = useState();
  const [coursePopularity, setCoursePopularity] = useState();
  const [difficulty, setDifficulty] = useState();
  // This avoids the useRef()'s not updating problem with useEffect().
  // See https://stackoverflow.com/a/67906087)
  // We can potentially include this pattern in the utils collection to reuse it.
  const [containerNode, setContainerNode] = useState(null);
  const containerRef = useCallback((node) => setContainerNode(node), []);
  const { user } = useContext(UserContext);
  const refreshCourseData = useCallback(
    (courseID) => {
      fetchCourseByID(courseID, user?.userID).then(setCourse);
      fetchReviewsByCourseID(courseID).then(setReviews);
      fetchReviewDifficultyByCourseID(courseID).then(setDifficulty);
      fetchReviewTagsByCourseID(courseID).then(setReviewTags);
      fetchProfessorByCourseID(courseID).then(setProfessors);
      fetchProfessorRanking(courseID).then(setProfessorRanking);
      fetchCourseLoad(courseID).then(setCourseLoad);
      fetchRatingTrend(courseID).then(setCourseTrend);
      fetchCoursePopularity(courseID).then(setCoursePopularity);
      if (user) fetchSemestersByCollegeID(user.collegeID).then(setSemesters);
    },
    [user]
  );

  useEffect(() => {
    const courseID = urlParams.id;

    // Clear existing course data to force showing loading indication.
    if (+courseID !== +course?.id) {
      setCourse(null);
      setReviews(null);
    }

    // Fetch related data.
    refreshCourseData(courseID);

    // Figure out the active tab from the URL.
    const tabParam = String(urlParams.tab).toLowerCase();
    setActiveTabName(tabs.hasOwnProperty(tabParam) ? tabParam : '');
  }, [urlParams, course?.id, refreshCourseData]);

  useEffect(() => {
    // Go to top of page (right below the banner image) when URL changes.
    const pageContent = containerNode?.children[0].children[0];
    if (pageContent) pageContent.scrollTo(0, Math.min(pageContent.scrollTop, imageHeight));
  }, [urlParams, containerNode]);

  return (
    <ContainerWithLoadingIndication
      isLoading={[
        refreshCourseData,
        course,
        reviews,
        difficulty,
        reviewTags,
        professors,
        professorRanking,
        courseLoad,
        courseTrend,
        coursePopularity,
      ].some((x) => x == null)}
    >
      <Box ref={containerRef} width='100%' height='100%' minHeight={0}>
        <OnTopScrollBars>
          <CoursePageTop course={course} tabs={tabs} activeTabName={activeTabName} />
          <Container maxWidth='xl' sx={{ paddingTop: '32px' }}>
            <CourseContext.Provider
              value={{
                refreshCourseData,
                course,
                reviews,
                difficulty,
                reviewTags,
                professors,
                semesters,
                professorRanking,
                courseLoad,
                courseTrend,
                coursePopularity,
              }}
            >
              {createElement(tabs[activeTabName].content)}
            </CourseContext.Provider>
          </Container>
        </OnTopScrollBars>
      </Box>
    </ContainerWithLoadingIndication>
  );
}

/**
 * @type {React.Context<{
 *   course: Object,
 *   reviews: Array<Object>,
 *   reviewTags: Array<Object>,
 *   refreshCourseData: (courseID: Number) => void,
 * }>}
 */
export const CourseContext = createContext(null);

const tabs = {
  '': { title: 'Overview', icon: Widgets, content: CourseOverview },
  'stats': { title: 'Stats', icon: PieChart, content: CourseStats },
  'reviews': { title: 'Reviews', icon: Forum, content: CourseReviews },
  'registration': { title: 'Registration', icon: ShoppingCart, content: CourseRegistration },
};

const OnTopScrollBars = ({ children }) => {
  /**
   * For some reason react-custom-scrollbars does not allow "inheriting" styles. It requires
   * us to always pass in this base styles when styling.
   * @see https://stackoverflow.com/a/54973078
   */
  const defaultScrollBarsStyle = {
    top: '2px',
    bottom: '2px',
    right: '2px',
    borderRadius: '3px',
  };

  return (
    <Scrollbars
      autoHide
      renderTrackVertical={({ style, ...props }) => (
        <div style={{ ...style, ...defaultScrollBarsStyle, zIndex: 1002 }} {...props} />
      )}
    >
      {children}
    </Scrollbars>
  );
};
