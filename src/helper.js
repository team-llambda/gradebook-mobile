const gradeToLetterConverter = grade => {
  var num = Number(grade)

  if (isNaN(num)) {
    return 'NaN'
  }
  if (num >= 90) {
    return "A"
  }
  if (num >= 80) {
    return "B"
  }
  if (num >= 70) {
    return "C"
  }
  if (num >= 60) {
    return "D"
  }
  if (num >= 50) {
    return "F"
  }
}

const parseGrade = (grade: string) => {
  if (grade.charAt(grade.length-1) === '%') {
    return Number(grade.substring(0, grade.length-1)).toFixed(2)
  }
  return Number(grade).toFixed(2)
}

const isAssignmentValid = assignment => {
  if (isNaN(assignment.pointsEarned) || isNaN(assignment.pointsTotal)) {
    return false;
  }
  if (assignment.pointsEarned === 0 && assignment.pointsTotal === 0) {
    return false;
  }
  if (assignment.comments !== undefined && assignment.comments.includes('Not For Grading')) {
    return false;
  }
  return true;
}

export {
  gradeToLetterConverter,
  isAssignmentValid,
  parseGrade
}