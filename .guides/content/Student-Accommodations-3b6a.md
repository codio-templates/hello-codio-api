##

At the beginning of the semester, easily add the correct time limit extensions on all exams for students who get time and a half or some other multiplier.

## Script overview
A student has accommodations and needs extended time on all timed assingments.

The script:
* [finds the student using their email](open_file src/IEP.ts panel=0 ref="students" count=6)
* [gets all assignments in the course](open_file src/IEP.ts panel=0 ref="const course " count=4)
* [checks if assignment has a time limit](open_file src/IEP.ts panel=0 ref="settings" count=4)
* [extends time limits according to multiplier](open_file src/IEP.ts panel=0 ref="timeLimit" count=4)

[Remove all highlighting](open_file src/IEP.ts panel=0)

## Using the script
To use this script, you need to fill out the following hardcoded values. Click to highlight the variable in the code file:
* [clientID](open_file src/IEP.ts panel=0 ref="clientId" count=1) (only if you did NOT set as an environment variable)
* [secret](open_file src/IEP.ts panel=0 ref="secret" count=1)  (only if you did NOT set as an environment variable)
* [courseId](open_file src/IEP.ts panel=0 ref="courseId" count=1)
    * Navigate to the course you want to use in a different tab and copy the course ID from the URL bar: `https://codio.com/home/teacher/course_id_string_here/overview`
* [the student's email address](open_file src/IEP.ts panel=0 ref="studentEmail" count=1)
* [the time limit multiplier (e.g. 1.5x, 2x, 3x)](open_file src/IEP.ts panel=0 ref="multiplier" count=1)

[Remove all highlighting](open_file src/IEP.ts panel=0)

|||important
### Codio ignores test students and teachers
If you are testing this API script, you will need to create a "real" test student as Codio ignores both test students, and students who are also course instructors -- meaning you will get a `student not found` error!

|||

Make any modifications as you see fit so that this script matches your use case. You can always refer to the original script here:
<details>
  <summary>
     <b>Copy of original script</b>
  </summary>

    require('dotenv').config()
    import codio from 'codio-api-js'
    import _ from 'lodash'
    const api = codio.v1

    const clientId = process.env['CLIENT'] || 'clientId'
    const secret = process.env['SECRET'] || 'secret'

    // hardcoded values
    const courseId = 'courseId'
    const studentEmail = 'student@email.com'
    const multiplier = 1.5

    async function main() {
      await api.auth(clientId, secret)

      const students = await api.course.getStudents(courseId)

      const student = _.find(students, {email: studentEmail})
      if (_.isUndefined(student)) {
          throw new Error(`${studentEmail} student not found`)
      }
      const course = await api.course.info(courseId)
      for (const module of course.modules) {
        console.log(`${module.name} :`)
        for (const assignment of module.assignments) {
          const settings = await api.assignment.getSettings(courseId, assignment.id)
          if (!settings.examMode || !settings.examMode.timedExamMode.enabled) { // not an exam
              continue
          }
          const timeLimit = settings.examMode.timedExamMode.duration * multiplier
          console.log(`Extend ${assignment.name} for Student ${student.name} timelimit to ${timeLimit} minutes`)
          await api.assignment.updateStudentTimeExtension(courseId, assignment.id, student.id, {
              extendedTimeLimit: timeLimit
          })
        }
      }
    }

    main().catch(_ => {
      console.error(_);
      process.exit(1)
    })
      
</details>

<br>
You can run the script on the left by pressing the button below:
{Run script | terminal}(yarn start src/IEP.ts)
