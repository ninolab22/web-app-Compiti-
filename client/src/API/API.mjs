
const SERVER_URL = "http://localhost:3001";

// --- STUDENTS ---

// GET /api/students
const getAllStudents = async () => {
  const response = await fetch(`${SERVER_URL}/api/students`, {
    credentials: 'include'
  });
  if (response.ok) {
    return await response.json();
  } else {
     const errMessage = await response.json();
    throw errMessage.error || "Error loading students.";
  }
};

// GET /api/students/stats
const getAllStudentsStats = async () => {
  const response = await fetch(`${SERVER_URL}/api/students/stats`, {
    credentials: 'include'
  });
  if (response.ok) {
    return await response.json();
  } else {
     const errMessage = await response.json();
    throw errMessage.error || "Error loading students statistics.";
  }
};

// GET /api/students/<id>/homeworks
const getStudentOpenHomeworks = async (studentId) => {
  const response = await fetch(`${SERVER_URL}/api/students/${studentId}/homeworks`, {
    credentials: 'include'
  });
  if (response.ok) {
    return await response.json();
  } else {
     const errMessage = await response.json();
    if (response.status === 422) {
      throw errMessage.errors[0].msg;
    } else {
      throw errMessage.error || "Error loading student's open homeworks.";
    }
  }
};

// GET /api/students/<id>/stats
const getStudentStats = async (studentId) => {
  const response = await fetch(`${SERVER_URL}/api/students/${studentId}/stats`, {
    credentials: 'include'
  });
  if (response.ok) {
    return await response.json();
  } else {
   const errMessage = await response.json();
    if (response.status === 422) {
      throw errMessage.errors[0].msg;
    } else {
      throw errMessage.error || "Error loading student's statistics.";
    }
  }
};

// --- HOMEWORKS ---

// POST /api/homeworks
const createHomework = async (question, studentIds) => {
  const response = await fetch(`${SERVER_URL}/api/homeworks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({ question, studentIds })
  });
  
  if (response.ok || response.status === 201) {
    return await response.json();
  } else {
    const errMessage = await response.json();
    
    if (response.status === 422) {
      
      if (errMessage.errors) {
        // Express-validator errors
        throw errMessage.errors[0].msg;
      } else {
        // Custom validation errors (checkPairsInGroup)
        throw errMessage.error;
      }
    } else {
      // other errors
      throw errMessage.error || "Error occurred while creating homework.";
    }
  }
};

//Get all homeworks
const getAllHomeworks = async () => {
  const response = await fetch(`${SERVER_URL}/api/homeworks`, {
    credentials: 'include'
  });
  if (response.ok) {
    return await response.json();
  } else {
    const errMessage = await response.json();
    throw errMessage.error || "Error loading homeworks.";
  }
};


// PATCH /api/homeworks/<id>/score
const gradeHomework = async (homeworkId, score) => {
  const response = await fetch(`${SERVER_URL}/api/homeworks/${homeworkId}/score`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({ score })
  });
  if (response.ok) {
    return null;
  } else {
    let errMessage = await response.json();
    if (response.status === 422) {
      const message = errMessage.errors[0].msg;
      throw message;
    } 
    else{
      errMessage = errMessage.error || "Error while grading homework.";
    throw errMessage;
  }
  }
};

// PATCH /api/homeworks/<id>/answer

const updateHomeworkAnswer = async (homeworkId, answer) => {
  const response = await fetch(`${SERVER_URL}/api/homeworks/${homeworkId}/answer`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({ answer })
  });
  
  if (response.ok) {
    return null;
  } else {
  
    let errMessage = await response.json();
    
    if (response.status === 422) {
      const message = errMessage.errors[0].msg;
      throw message;
    } 
    else if (response.status === 409) {
      throw errMessage.error || "Homework is already closed and cannot be modified.";
    } 
    else {
      throw errMessage.error || "Error updating homework answer.";
    }
  }
};

const login = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const logout = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
};

export async function getSession() {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include'
  });
  if (response.ok) return await response.json();
  else throw new Error('Not authenticated');
}


const API = {
  getAllStudents,
  getAllStudentsStats,
  getStudentOpenHomeworks,
  getStudentStats,
  createHomework,
  gradeHomework,
  updateHomeworkAnswer,
  getAllHomeworks,
  login,
  logout,
  getSession
};

export default API;