import axios from 'axios';
import { getColorByString } from 'utils';

export const login = (email, password) =>
  axios.post('/login', { email, password }).then(({ data }) => formatUserInfo(data.data, true));

const formatUserInfo = ({ id, token, ...userInfo }, shouldIncludeToken = false) => ({
  name: `${userInfo.firstName} ${userInfo.lastName}`,
  userID: id,
  ...userInfo,
  ...(shouldIncludeToken && { token }),
});

export const register = (email, firstName, lastName, college, password, rePassword) =>
  axios
    .post('/register', { email, firstName, lastName, college, password, rePassword })
    .then(({ data }) => data);

export const fetchCollegeMajorList = (collegeID) =>
  axios.get(`/college/${collegeID}/major/list`).then(({ data }) => data.data);

export const fetchMajorEmphasisList = (collegeID, majorName) =>
  axios.get(`/college/${collegeID}/emphasis?major=${majorName}`).then(({ data }) => data.data);

export const declareMajor = (userID, majorName, emphasisName, schoolYear) =>
  axios
    .post('/user/major', { userID, majorName, emphasisName, schoolYear })
    .then(({ data }) => formatUserInfo(data.data));

/**
 * Fetches the course but also injects the fake image URL. Basically pretends `ImageURL` was an
 * actual field of the course.
 */
export const fetchCourseByID = (courseID, userID = NaN) =>
  new Promise((onFetched) =>
    axios.get(`/course/${courseID}${isNaN(userID) ? '' : '?userID=' + userID}`).then((data) => {
      const course = data.data.data;
      injectFakePropertiesToCourse(course);
      onFetched(course);
    })
  );

const getFakeCourseImageURL = (course) =>
  `https://singlecolorimage.com/get/${getColorByCourse(course).substring(1)}/512x216`;

export const getColorByCourse = (course) => getColorByString(course.catalogCourseName);

const injectFakePropertiesToCourse = (course) => {
  course.ImageURL = getFakeCourseImageURL(course);
  // Hide courses that don't have a start time (corrupted data from backend?)
  course.classes = course.classes.filter((x) => !x.offerDate || x.startTime);
  injectLocationMapURLToClasses(course.classes);
};

export const fetchHomePageCourses = (userID = NaN) => fakeFetchHomePageCourses();

// TODO (QC): Get rid of this, although it might be hard to.
const fakeFetchHomePageCourses = (userID) => {
  const recommendedCategories = {
    // 'Major Requirements To Go': [22963],
    // 'Major Requirements To Go': [22948, 22949, 22963],
    // 'Highest Rated Electives': [22961, 22971, 22951, 22970, 22998, 23000],
    'Highest Rated Math/Science Courses': [27247, 27245, 22417, 22933, 21976, 27266],
    'Highest Rated Gen-Ed Courses': [
      31826, 28270, 24777, 21978, 28354, 29897, 30546, 24764, 21072, 31570,
    ],
  };

  return Promise.all(
    Object.entries(recommendedCategories).map(([category, courseIDs]) =>
      Promise.all(courseIDs.map((id) => fetchCourseByID(id, userID))).then((courses) => ({
        category,
        courses,
      }))
    )
  );
};

export const fetchCoursesBySearch = (query, userID = NaN, pageNumber = 0) =>
  axios
    .post('/course/search', { keyword: query, pageSize: 12, userID, pageNumber: pageNumber })
    .then(({ data }) => {
      for (let course of data.data) injectFakePropertiesToCourse(course);
      return data;
    });

export const fetchClassByID = (classID) => axios.get(`/class/${classID}`);

export const fetchClassesByCourseID = (courseID) => axios.get(`/course/${courseID}/class`);

/**
 * Fetches ```
 * {
 *   scheduledClasses: Array<{classData, course}>,
 *   customEvents: Array<CustomEvent>
 * }
 * ```.
 */
export const fetchScheduledClassesAndCustomEvents = (userID) =>
  axios.get(`schedule?userID=${userID}`).then(({ data }) => {
    for (let { course } of data.data.scheduledClasses) injectFakePropertiesToCourse(course);
    return data.data;
  });

// TODO Q: Get rid of all this once the backend has the support for it.
const injectLocationMapURLToClasses = (classes) => {
  for (let classData of classes) {
    const buildingNumber = getBuildingNumberByLocation(classData.location);
    if (buildingNumber) {
      classData.locationMapURL = 'https://map.utah.edu/?buildingnumber=' + buildingNumber;
    }
  }
};

const getBuildingNumberByLocation = (location) => {
  // prettier-ignore
  const ids = [[1,'PARK'],[2,'VOICE'],[3,'DGH'],[4,'KH'],[5,'CSC'],[6,'ST'],[7,'LS'],[8,'AEB'],[9,'JWB'],[10,'PHYS'],[11,'WBB'],[12,'FASB'],[13,'LCB'],[14,'JTB'],[17,'PAB'],[19,'INSCC'],[25,'BEH S'],[26,'SW'],[27,'S BEH'],[28,'MCD'],[29,'FLD H'],[30,'PLAZA'],[32,'STAD'],[35,'UMFA'],[36,'FMAB'],[37,'ARCH'],[38,'ART'],[39,'SCULPT'],[40,'SSB'],[41,'NWPG'],[43,'NS'],[44,'BLDG 44'],[45,'CTIHB'],[46,'LSND'],[48,'GC'],[49,'LNCO'],[51,'SILL'],[52,'ALUMNI'],[53,'UNION'],[56,'CME'],[57,'HEDCO'],[58,'MPL'],[59,'MSRL'],[60,'ESB'],[61,'MCE'],[62,'WEB'],[64,'MEB'],[66,'PMT'],[67,'U CAMPSTOR'],[69,'CPG'],[70,'LAW'],[71,'SAEC'],[72,'BLDG 72'],[73,'PTAB'],[74,'BU C'],[77,'CRCC'],[79,'SFEBB'],[80,'GARFF'],[82,'ASB'],[83,'JFB'],[84,'BIOL'],[85,'HEB'],[86,'M LIB'],[87,'TBBC'],[90,'JHC'],[91,'HPR E'],[92,'HPR N'],[93,'HPRNAT'],[94,'HPR W'],[95,'HPR SW'],[96,'HPR SE'],[97,'DGC'],[98,'KBAC'],[99,'HBF'],[108,'GLF SH'],[109,'DFSS'],[110,'GSESLC'],[112,'MHC'],[114,'KV'],[119,'BRIDGE'],[120,'SKI']];

  return (
    ids.find((x) => x[1] === location?.split(' ')[0])?.[0] ||
    ids.find((x) => x[1] === location?.split(' ').slice(0, 2).join(' '))?.[0]
  );
};

export const addOrUpdateCustomEvent = (userID, customEvent) =>
  axios.post('/schedule?type=custom-event', {
    isNew: !(+customEvent.id >= 0),
    userID,
    customEvent,
  });

export const removeCustomEventByID = (eventID) =>
  axios.put('/schedule?type=custom-event', { id: eventID });

export const fetchRequirements = async (user) => {
  const { scheduledClasses } = await fetchScheduledClassesAndCustomEvents(user.userID);
  const historyCourses = await fetchHistoryCourses(user.userID);
  const requirements = user.major
    ? await fetchRequirementsByMajor(user.major, user.emphasis)
    : [];
  return getRequirementsFromScheduleAndHistory(
    requirements,
    scheduledClasses.map((x) => x.course),
    historyCourses
  );
};

const fetchRequirementsByMajor = (majorName, emphasisName) =>
  axios
    .get(`college/2/major/course/requirements?major=${majorName}&emphasis=${emphasisName}`)
    .then(({ data }) => data.data);

/** Argument `requirements` is modified in-place. */
export const getRequirementsFromScheduleAndHistory = (
  requirements,
  scheduledCourses,
  historyCourses
) => {
  for (let requirement of requirements) {
    requirement.title = requirement.setName.replace(/courses/gi, '').trim();

    requirement.completedCourses = [];
    requirement.inProgressCourses = [];
  }

  for (let course of scheduledCourses) {
    const targets = requirements.filter((x) =>
      (course.degreeCatalogs || []).map((y) => y[0]).includes(x.setName)
    );
    for (let target of targets)
      if (!target.inProgressCourses.find((x) => x.id === course.id))
        target.inProgressCourses.push(course);
  }
  for (let course of historyCourses) {
    const targets = requirements.filter((x) =>
      (course.degreeCatalogs || []).map((y) => y[0]).includes(x.setName)
    );
    for (let target of targets)
      if (
        !target.completedCourses.find((x) => x.id === course.id) &&
        !target.inProgressCourses.find((x) => x.id === course.id)
      )
        target.completedCourses.push(course);
  }

  return requirements;
};

export const addClassIDToSchedule = (userID, classID) =>
  axios.post('/schedule?type=class', { userID, classID });

export const removeClassIDFromSchedule = (userID, classID) =>
  axios.put('/schedule?type=class', { userID, classID });

/**
 * Fetches the courses a user has taken in the past.
 *
 * @param {Number} userID
 * @return {Promise<Array<Object>>}
 */
export const fetchHistoryCourses = (userID) =>
  axios.get(`/user/${userID}/history`).then(({ data }) => {
    for (let course of data.data) injectFakePropertiesToCourse(course);
    return data.data;
  });

/**
 * Ensures that a user's history contains a particular course.
 *
 * Note: this function is called "add or update" to reserve the option of letting users edit the
 * semester and instructor for a history course.
 *
 * @param {Number} userID
 * @param {Number} courseID The ID of the course to add or update.
 */
export const addOrUpdateHistoryCourse = (userID, courseID) =>
  axios.post('/user/history', { userID, courseID });

/**
 * Ensures that a user's history does not contain a particular course.
 *
 * @param {Number} userID
 * @param {Number} courseID The ID of the course to remove.
 */
export const removeHistoryCourse = (userID, courseID) =>
  axios.put('/user/history', { userID, courseID });

export const fetchReviewsByCourseID = (courseID) =>
  axios.get(`/course/${courseID}/review`).then((data) => data.data.data.reviews);

export const postReview = (courseID, body) => axios.post(`/course/${courseID}/review`, body);
export const postTagsByCourseID = (courseID, body) =>
  axios.post(`/course/${courseID}/tag`, body);
export const putTagsByCourseID = (courseID, body) => axios.put(`/course/${courseID}/tag`, body);

export const fetchTagList = () => axios.get('/course/tag').then((data) => data.data.data);

export const fetchProfessorList = () =>
  axios.get('/professor/list').then((data) => data.data.data);

export const fetchReviewTagsByCourseID = (courseID, body) =>
  axios.get(`/course/${courseID}/tag`).then((data) => data.data.data);

export const fetchProfessorByCourseID = (courseID, body) =>
  axios.get(`/course/${courseID}/professor/list`).then((data) => data.data.data);

export const fetchSemestersByCollegeID = (collegeID, body) =>
  axios.get(`/college/${collegeID}/semester/list`).then((data) => data.data.data);

export const fetchCollegeList = () => axios.get(`/college/list`).then(({ data }) => data.data);

// export const fetchProfessorRanking = (courseID, body) =>
//   axios.get(`/stats/course/${courseID}/professor/rank`).then((data) => data);
// export const fetchCourseLoad = (courseID, body) =>
//   axios.get(`/stats/course/${courseID}/load`).then((data) => data);

export const fetchCourseLoad = async (courseID, body) => {
  const res = await axios.get(`/stats/course/${courseID}/load`);
  return await res.data.data;
};

export const fetchProfessorRanking = async (courseID, body) => {
  const res = await axios.get(`/stats/course/${courseID}/professor/rank`);
  return await res.data.data;
};

export const fetchRatingTrend = async (courseID, body) => {
  const res = await axios.get(`/stats/course/${courseID}/rating/trend`);
  return await res.data.data;
};
