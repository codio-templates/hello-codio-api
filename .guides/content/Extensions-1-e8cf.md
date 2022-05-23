##

Use a script to easily add extensions for a student who is out sick for specific assignments and/or modules

## Script overview
A student let's you know they are sick and needs all the assignment due dates in this week's module, as well as the first two assignments in next week's module, to be extended by a set number of days.

The script:
* [finds the student using their email](open_file src/sliding-extension.ts panel=0 ref="students" count=6)
* [finds all the assignments in the sepcified listed modules](open_file src/sliding-extension.ts panel=0 ref="course.modules" count=5)
* [finds the specified assignments](open_file src/sliding-extension.ts panel=0 ref="const assignment " count=5)
* [adjusts the deadlines](open_file src/sliding-extension.ts panel=0 ref="const extend" count=8)
  

[Remove all highlighting](open_file src/sliding-extension.ts panel=0)

## Using the script
To use this script, you need to fill out the following hardcoded values. Click to highlight the variable in the code file:
* [clientID](open_file src/sliding-extension.ts panel=0 ref="clientId" count=1) (only if you did NOT set as an environment variable)
* [secret](open_file src/sliding-extension.ts panel=0 ref="secret" count=1)  (only if you did NOT set as an environment variable)
* [courseId](open_file src/sliding-extension.ts panel=0 ref="courseId" count=1)
    * Navigate to the course you want to use in a different tab and copy the course ID from the URL bar: `https://codio.com/home/teacher/course_id_string_here/overview`
* [the student's email address](open_file src/sliding-extension.ts panel=0 ref="studentEmail" count=1)
* a set of [assignment name(s) and/or module name(s)](open_file src/sliding-extension.ts panel=0 ref="moduleName" count=2)
* the number of [days/hours/minutes](open_file src/sliding-extension.ts panel=0 ref="shiftDays" count=3) the assignments should be extended.

[Remove all highlighting](open_file src/sliding-extension.ts panel=0)

Make any modifications as you see fit so that this script matches your use case. You can always refer to the original script here:
<details>
  <summary>
     <b>Copy of original script</b>
  </summary>

    require('dotenv').config()
    import codio from 'codio-api-js'
    import { Assignment } from 'codio-api-js/lib/lib/course'
    import _ from 'lodash'
    const api = codio.v1

    const clientId = process.env['CLIENT'] || 'clientId'
    const secret = process.env['SECRET'] || 'secret'

    // hardcoded values
    const courseId = 'courseId'
    const studentEmail = 'student@email.com'
    let moduleName = 'module name'
    let assignmentNames = 'assignment 1,assignment 2'
    let shiftDays = 2
    let shiftHours = 12
    let shiftMinutes = 30

    function applyEnv() {
      const _shiftDays = _.toNumber(process.env['SHIFT_DAYS'])
      const _shiftHours = _.toNumber(process.env['SHIFT_HOURS'])
      const _shiftMinutes = _.toNumber(process.env['SHIFT_MINUTES'])
      if (!_.isNaN(_shiftDays)) {
        shiftDays = _shiftDays
      }
      if (!_.isNaN(_shiftHours)) {
        shiftHours = _shiftHours
      }
      if (!_.isNaN(_shiftMinutes)) {
        shiftMinutes = _shiftMinutes
      }
    }

    async function main() {
      applyEnv()
      await api.auth(clientId, secret)
      const assignments = _.compact(assignmentNames.split(','))
      const students = await api.course.getStudents(courseId)

      const student = _.find(students, {email: studentEmail})
      if (_.isUndefined(student)) {
          throw new Error(`${studentEmail} student not found`)
      }
      const course = await api.course.info(courseId)
      const toExtend: Assignment[] = []
      for (const module of course.modules) {
        if (module.name === moduleName) {
          toExtend.push.apply(module.assignments)
          continue
        }
        for (const assignment of module.assignments) {
          if (assignments.includes(assignment.name)) {
            toExtend.push(assignment)
          }
        }
      }

      const extend = shiftDays * 24 * 60 + shiftHours * 60 + shiftMinutes

      for(const assignment of toExtend) {
        console.log(`Extend ${assignment.name} for Student ${student.name} deadline on ${extend} minutes`)
        await api.assignment.updateStudentTimeExtension(courseId, assignment.id, student.id, {
            extendedDeadline: extend
        })
      }
    }

    main().catch(_ => {
      console.error(_);
      process.exit(1)
    })


</details>

<br>
You can run the script on the left by pressing the button below:
{Run script | terminal}(yarn start src/sliding-extension.ts)
